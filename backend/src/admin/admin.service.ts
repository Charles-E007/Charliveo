import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema.js';
import { Monitor, MonitorDocument } from '../schemas/monitor.schema.js';

interface MonitorStatsRow {
  _id: any;
  monitorsCount: number;
  upCount: number;
  downCount: number;
  pausedCount: number;
  pendingCount: number;
  latencySum: number;
  latencySamples: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Monitor.name) private monitorModel: Model<MonitorDocument>,
  ) {}

  /**
   * Vue d'ensemble administrateur : liste des utilisateurs inscrits enrichie de
   * leurs statistiques de monitoring, et totaux globaux de la plateforme.
   */
  async getUsersOverview() {
    const [users, statsRows] = await Promise.all([
      this.userModel.find().select('-passwordHash -apiKey').sort({ createdAt: -1 }).lean().exec(),
      this.monitorModel.aggregate<MonitorStatsRow>([
        {
          $group: {
            _id: '$userId',
            monitorsCount: { $sum: 1 },
            upCount: {
              $sum: { $cond: [{ $and: ['$isActive', { $eq: ['$lastStatus', 'UP'] }] }, 1, 0] },
            },
            downCount: {
              $sum: { $cond: [{ $and: ['$isActive', { $eq: ['$lastStatus', 'DOWN'] }] }, 1, 0] },
            },
            pausedCount: { $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] } },
            pendingCount: {
              $sum: { $cond: [{ $and: ['$isActive', { $eq: ['$lastStatus', 'PENDING'] }] }, 1, 0] },
            },
            // Seuls les moniteurs déjà pingés au moins une fois entrent dans la moyenne
            latencySum: {
              $sum: { $cond: [{ $gt: ['$lastResponseTimeMs', 0] }, '$lastResponseTimeMs', 0] },
            },
            latencySamples: { $sum: { $cond: [{ $gt: ['$lastResponseTimeMs', 0] }, 1, 0] } },
          },
        },
      ]),
    ]);

    const statsByUser = new Map<string, MonitorStatsRow>();
    for (const row of statsRows) {
      statsByUser.set(String(row._id), row);
    }

    const enrichedUsers = users.map((user: any) => {
      const stats = statsByUser.get(String(user._id));

      return {
        _id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt ?? null,
        monitorsCount: stats?.monitorsCount ?? 0,
        upCount: stats?.upCount ?? 0,
        downCount: stats?.downCount ?? 0,
        pausedCount: stats?.pausedCount ?? 0,
        pendingCount: stats?.pendingCount ?? 0,
        avgLatencyMs: this.average(stats?.latencySum ?? 0, stats?.latencySamples ?? 0),
      };
    });

    // Les totaux portent sur l'ensemble des moniteurs de la plateforme
    const totals = statsRows.reduce(
      (acc, row) => ({
        monitors: acc.monitors + row.monitorsCount,
        up: acc.up + row.upCount,
        down: acc.down + row.downCount,
        paused: acc.paused + row.pausedCount,
        pending: acc.pending + row.pendingCount,
        latencySum: acc.latencySum + row.latencySum,
        latencySamples: acc.latencySamples + row.latencySamples,
      }),
      { monitors: 0, up: 0, down: 0, paused: 0, pending: 0, latencySum: 0, latencySamples: 0 },
    );

    return {
      totals: {
        users: users.length,
        admins: users.filter((u: any) => u.role === 'ADMIN').length,
        monitors: totals.monitors,
        up: totals.up,
        down: totals.down,
        paused: totals.paused,
        pending: totals.pending,
        avgLatencyMs: this.average(totals.latencySum, totals.latencySamples),
      },
      users: enrichedUsers,
    };
  }

  private average(sum: number, samples: number): number {
    return samples > 0 ? Math.round(sum / samples) : 0;
  }
}
