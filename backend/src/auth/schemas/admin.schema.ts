import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  // bcrypt hash only — plaintext password is never persisted or logged.
  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ required: true, default: 'admin', enum: ['admin'] })
  role: string;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
