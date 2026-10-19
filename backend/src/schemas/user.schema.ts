import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true, sparse: true, index: true })
  apiKey: string;

  @Prop({ type: String, enum: ['USER', 'ADMIN'], default: 'USER' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);