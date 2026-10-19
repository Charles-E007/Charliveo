import { Controller, Post, Get, Put, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user._id.toString(), updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async patchProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user._id.toString(), updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account')
  async deleteAccount(@Request() req: any) {
    return this.authService.deleteAccount(req.user._id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Request() req: any) {
    return this.authService.deleteAccount(req.user._id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Post('api-key')
  async generateApiKey(@Request() req: any) {
    return this.authService.generateNewApiKey(req.user._id.toString());
  }
}
