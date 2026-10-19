import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Monitor, MonitorDocument } from '../schemas/monitor.schema.js';
import { PingLog, PingLogDocument } from '../schemas/ping-log.schema.js';
import { CreateMonitorDto } from './dto/create-monitor.dto.js';
import { UpdateMonitorDto } from './dto/update-monitor.dto.js';
import axios from 'axios';

@Injectable()
export class MonitorsService {
  constructor(
    @InjectModel(Monitor.name) private monitorModel: Model<MonitorDocument>,
    @InjectModel(PingLog.name) private pingLogModel: Model<PingLogDocument>,
  ) {}

  async create(userId: string, createMonitorDto: CreateMonitorDto): Promise<MonitorDocument> {
    return this.monitorModel.create({
      ...createMonitorDto,
      userId: new Types.ObjectId(userId),
    });
  }

  async findAllByUser(userId: string): Promise<MonitorDocument[]> {
    return this.monitorModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<MonitorDocument> {
    const monitor = await this.monitorModel.findById(id).exec();
    if (!monitor) {
      throw new NotFoundException('Moniteur introuvable');
    }
    if (monitor.userId.toString() !== userId) {
      throw new ForbiddenException('Accès refusé à ce moniteur');
    }
    return monitor;
  }

  async update(id: string, userId: string, updateMonitorDto: UpdateMonitorDto): Promise<MonitorDocument> {
    await this.findOne(id, userId); // Vérification des droits
    const updated = await this.monitorModel.findByIdAndUpdate(id, updateMonitorDto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Moniteur introuvable');
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    await this.findOne(id, userId);
    await this.pingLogModel.deleteMany({ monitorId: new Types.ObjectId(id) });
    await this.monitorModel.findByIdAndDelete(id);
    return { message: 'Moniteur et historique des pings supprimés avec succès' };
  }

  async togglePause(id: string, userId: string): Promise<MonitorDocument> {
    const monitor = await this.findOne(id, userId);
    monitor.isActive = !monitor.isActive;
    monitor.lastStatus = monitor.isActive ? 'PENDING' : 'PAUSED';
    return monitor.save();
  }

  async pingNow(monitorId: string, userId: string) {
    const monitor = await this.findOne(monitorId, userId);

    const startTime = Date.now();
    let status = 'UP';
    let statusCode = 200;
    let responseTimeMs = 0;

    // Conversion si headers est une Map Mongoose
    const headersObject = monitor.headers instanceof Map 
      ? Object.fromEntries(monitor.headers) 
      : (monitor.headers || {});

    let errorMessage: string | undefined = undefined;
    let requestData: any = undefined;
    if (monitor.body) {
      try {
        requestData = typeof monitor.body === 'string' ? JSON.parse(monitor.body) : monitor.body;
      } catch {
        requestData = monitor.body;
      }
    }

    try {
      const response = await axios({
        method: monitor.method || 'GET',
        url: monitor.url,
        headers: headersObject,
        data: requestData,
        timeout: 10000,
        validateStatus: () => true,
      });
      statusCode = response.status;
      responseTimeMs = Date.now() - startTime;
      const isSuccess = statusCode >= 200 && statusCode < 400;
      status = isSuccess ? 'UP' : 'DOWN';
      if (!isSuccess) {
        errorMessage = `HTTP Status ${statusCode}`;
      }
    } catch (error: any) {
      status = 'DOWN';
      statusCode = error.response?.status || 500;
      responseTimeMs = Date.now() - startTime;
      errorMessage = error.message || 'Erreur réseau ou timeout';
    }

    const executedAt = new Date();
    const isSuccess = status === 'UP';

    // 1. Utilisation de lastPingAt (conforme à MonitorSchema)
    monitor.lastStatus = status;
    monitor.lastResponseTimeMs = responseTimeMs;
    monitor.lastPingAt = executedAt;
    if (isSuccess) {
      monitor.consecutiveFailures = 0;
    } else {
      monitor.consecutiveFailures = (monitor.consecutiveFailures || 0) + 1;
    }
    await monitor.save();

    // 2. Utilisation de isSuccess (conforme à PingLogSchema)
    await this.pingLogModel.create({
      monitorId: monitor._id,
      isSuccess,
      statusCode,
      responseTimeMs,
      errorMessage,
      executedAt,
    });

    return {
      message: 'Ping exécuté avec succès',
      status,
      statusCode,
      responseTimeMs,
    };
  }
  async getLogs(id: string, userId: string, limit = 50): Promise<PingLogDocument[]> {
    await this.findOne(id, userId);
    return this.pingLogModel
      .find({ monitorId: new Types.ObjectId(id) })
      .sort({ executedAt: -1 })
      .limit(limit)
      .exec();
  }
}