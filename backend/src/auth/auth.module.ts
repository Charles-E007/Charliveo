import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { User, UserSchema } from '../schemas/user.schema.js';
import { Monitor, MonitorSchema } from '../schemas/monitor.schema.js';
import { PingLog, PingLogSchema } from '../schemas/ping-log.schema.js';
import { NotificationChannel, NotificationChannelSchema } from '../schemas/notification-channel.schema.js';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Monitor.name, schema: MonitorSchema },
      { name: PingLog.name, schema: PingLogSchema },
      { name: NotificationChannel.name, schema: NotificationChannelSchema },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '72h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
