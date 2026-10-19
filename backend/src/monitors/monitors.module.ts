import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MonitorsService } from './monitors.service.js';
import { MonitorsController } from './monitors.controller.js';
import { PingSchedulerService } from './ping-scheduler.service.js';
import { Monitor, MonitorSchema } from '../schemas/monitor.schema.js';
import { PingLog, PingLogSchema } from '../schemas/ping-log.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monitor.name, schema: MonitorSchema },
      { name: PingLog.name, schema: PingLogSchema },
    ]),
    HttpModule,
  ],
  controllers: [MonitorsController],
  providers: [MonitorsService, PingSchedulerService],
  exports: [MonitorsService],
})
export class MonitorsModule {}