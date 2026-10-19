import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User, UserDocument } from '../schemas/user.schema.js';
import { Monitor, MonitorDocument } from '../schemas/monitor.schema.js';
import { PingLog, PingLogDocument } from '../schemas/ping-log.schema.js';
import { NotificationChannel, NotificationChannelDocument } from '../schemas/notification-channel.schema.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Monitor.name) private monitorModel: Model<MonitorDocument>,
    @InjectModel(PingLog.name) private pingLogModel: Model<PingLogDocument>,
    @InjectModel(NotificationChannel.name) private notificationChannelModel: Model<NotificationChannelDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const apiKey = 'ka_' + randomBytes(24).toString('hex');

    const newUser = await this.userModel.create({
      email,
      fullName,
      passwordHash,
      apiKey,
    });

    const token = this.generateJwt(newUser._id.toString(), newUser.email);

    return {
      message: 'Inscription réussie',
      accessToken: token,
      user: {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        apiKey: newUser.apiKey,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const token = this.generateJwt(user._id.toString(), user.email);

    return {
      message: 'Connexion réussie',
      accessToken: token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        apiKey: user.apiKey,
      },
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { fullName: updateProfileDto.fullName },
      { new: true },
    ).select('-passwordHash');

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async deleteAccount(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    // 1. Supprimer tous les logs de pings liés aux moniteurs de l'utilisateur
    const monitors = await this.monitorModel.find({ userId: userObjectId }).select('_id').exec();
    const monitorIds = monitors.map((m) => m._id);

    if (monitorIds.length > 0) {
      await this.pingLogModel.deleteMany({ monitorId: { $in: monitorIds } as any }).exec();
    }

    // 2. Supprimer tous les moniteurs de l'utilisateur
    await this.monitorModel.deleteMany({ userId: userObjectId }).exec();

    // 3. Supprimer tous les canaux de notifications
    await this.notificationChannelModel.deleteMany({ userId: userObjectId as any }).exec();

    // 4. Supprimer l'utilisateur
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return { message: 'Compte supprimé avec succès' };
  }

  async generateNewApiKey(userId: string) {
    const newApiKey = 'ka_' + randomBytes(24).toString('hex');
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { apiKey: newApiKey },
      { new: true },
    ).select('-passwordHash');

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return { apiKey: user.apiKey };
  }

  private generateJwt(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
