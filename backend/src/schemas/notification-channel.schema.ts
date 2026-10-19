import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationChannelDocument = NotificationChannel & Document;

@Schema({ timestamps: true })
export class NotificationChannel {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ['DISCORD_WEBHOOK', 'SLACK_WEBHOOK', 'EMAIL'], required: true })
  type: string;

  @Prop({ required: true })
  target: string;

  @Prop({ default: true })
  isEnabled: boolean;
}

export const NotificationChannelSchema = SchemaFactory.createForClass(NotificationChannel);