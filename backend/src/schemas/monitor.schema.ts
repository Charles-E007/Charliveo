import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MonitorDocument = Monitor & Document;

@Schema({ timestamps: true })
export class Monitor {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ type: String, enum: ['GET', 'POST', 'HEAD', 'PUT'], default: 'GET' })
  method: string;

  @Prop({ required: true, min: 1, max: 60, default: 10 })
  intervalMinutes: number;

  @Prop({ type: Map, of: String, default: {} })
  headers: Record<string, string>;

  @Prop({ type: String, default: null })
  body: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, enum: ['UP', 'DOWN', 'PENDING', 'PAUSED'], default: 'PENDING' })
  lastStatus: string;

  @Prop({ type: Date, default: null })
  lastPingAt: Date;

  @Prop({ type: Number, default: 0 })
  lastResponseTimeMs: number;

  @Prop({ type: Number, default: 100 })
  uptimePercentage: number;

  @Prop({ type: Number, default: 3 })
  failureThreshold: number;

  @Prop({ type: Number, default: 0 })
  consecutiveFailures: number;
}

export const MonitorSchema = SchemaFactory.createForClass(Monitor);