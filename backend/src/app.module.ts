import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module.js';
import { MonitorsModule } from './monitors/monitors.module.js';
import { User, UserSchema } from './schemas/user.schema.js';
import { Monitor, MonitorSchema } from './schemas/monitor.schema.js';
import { PingLog, PingLogSchema } from './schemas/ping-log.schema.js';
import { NotificationChannel, NotificationChannelSchema } from './schemas/notification-channel.schema.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Monitor.name, schema: MonitorSchema },
      { name: PingLog.name, schema: PingLogSchema },
      { name: NotificationChannel.name, schema: NotificationChannelSchema },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    MonitorsModule,
  ],
})
export class AppModule {}