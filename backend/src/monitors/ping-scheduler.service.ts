import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Monitor, MonitorDocument } from '../schemas/monitor.schema.js';
import { PingLog, PingLogDocument } from '../schemas/ping-log.schema.js';

@Injectable()
export class PingSchedulerService {
  private readonly logger = new Logger(PingSchedulerService.name);

  constructor(
    @InjectModel(Monitor.name) private monitorModel: Model<MonitorDocument>,
    @InjectModel(PingLog.name) private pingLogModel: Model<PingLogDocument>,
    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron(): Promise<void> {
    const now = new Date();
    const activeMonitors = await this.monitorModel.find({ isActive: true }).exec();

    for (const monitor of activeMonitors) {
      if (this.shouldPing(monitor, now)) {
        void this.executePing(monitor);
      }
    }
  }

  private shouldPing(monitor: MonitorDocument, now: Date): boolean {
    if (!monitor.lastPingAt) return true;
    const diffInMinutes = (now.getTime() - monitor.lastPingAt.getTime()) / (1000 * 60);
    return diffInMinutes >= monitor.intervalMinutes;
  }

  async executePing(monitor: MonitorDocument): Promise<void> {
    const startTime = Date.now();
    let statusCode = 0;
    let isSuccess = false;
    let errorMessage: string | null = null;

    try {
      const response = await firstValueFrom(
        this.httpService.request({
          method: monitor.method || 'GET',
          url: monitor.url,
          headers: monitor.headers || {},
          data: monitor.body ? JSON.parse(monitor.body) : undefined,
          timeout: 10000,
          validateStatus: () => true,
        }),
      );

      statusCode = response.status;
      isSuccess = statusCode >= 200 && statusCode < 400;
    } catch (error: any) {
      statusCode = error.response?.status || 500;
      errorMessage = error.message || 'Erreur réseau ou timeout';
      isSuccess = false;
    }

    const responseTimeMs = Date.now() - startTime;
    const executedAt = new Date();

    await this.pingLogModel.create({
      monitorId: monitor._id as Types.ObjectId,
      statusCode,
      responseTimeMs,
      isSuccess,
      errorMessage: errorMessage ?? undefined,
      executedAt,
    });

    monitor.lastPingAt = executedAt;
    monitor.lastResponseTimeMs = responseTimeMs;
    monitor.lastStatus = isSuccess ? 'UP' : 'DOWN';

    if (isSuccess) {
      monitor.consecutiveFailures = 0;
    } else {
      monitor.consecutiveFailures += 1;
    }

    await monitor.save();
    this.logger.log(`Ping exécuté sur [${monitor.name}] (${monitor.url}) - Status: ${statusCode} - Latence: ${responseTimeMs}ms`);
  }
}