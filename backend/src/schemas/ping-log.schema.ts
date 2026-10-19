import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PingLogDocument = PingLog & Document;

@Schema({ timestamps: false })
export class PingLog {
  @Prop({ type: Types.ObjectId, ref: 'Monitor', required: true, index: true })
  monitorId: Types.ObjectId;

  @Prop({ required: true })
  statusCode: number;

  @Prop({ required: true })
  responseTimeMs: number;

  @Prop({ required: true })
  isSuccess: boolean;

  @Prop({ type: String, default: null })
  errorMessage?: string;

  @Prop({ type: Date, default: Date.now, index: true })
  executedAt: Date;
}

export const PingLogSchema = SchemaFactory.createForClass(PingLog);