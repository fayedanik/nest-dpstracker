import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class SessionDocument {
  @Prop({ type: String, default: uuidv4 })
  declare _id: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  refreshTokenHash: string;
  @Prop({ type: String, required: true })
  argonHash: string;
  @Prop({ type: String, required: true })
  clientId: string;
  @Prop({ type: Boolean, default: true })
  valid: boolean;
  @Prop({ type: Date, required: true })
  issuedAt: Date;
  @Prop({ type: Date, required: true })
  expiredAt: Date;
}

export type Session = SessionDocument & Document;
export const SessionSchema = SchemaFactory.createForClass(SessionDocument);
