import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';
import { User, UserSchema } from '../schemas/user.schema.js';
import { Monitor, MonitorSchema } from '../schemas/monitor.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Monitor.name, schema: MonitorSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
