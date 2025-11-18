import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BaseSchema } from './base.schema';
import { Role } from '../../shared/consts/role.const';

@Schema({ collection: `users`, timestamps: true, versionKey: false })
export class UserDocument extends BaseSchema {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: [String], default: [Role.User] })
  roles: string[];

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Prop({ type: String, default: null })
  emailVerificationToken: string | null;

  @Prop({ type: String, default: null })
  phoneVerificationToken: string | null;

  @Prop({ type: Date, default: null })
  lastLogin: Date | null;

  @Prop({ type: Date, default: null })
  passwordChangedAt: Date | null;

  @Prop({ type: String, default: null })
  passwordResetToken: string | null;

  @Prop({ type: Date, default: null })
  passwordResetExpires: Date | null;

  @Prop({ type: Date })
  activationDate: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
