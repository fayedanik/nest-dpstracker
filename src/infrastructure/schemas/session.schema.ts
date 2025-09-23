import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
@Schema({})
export class Session {
  @Prop({ type: String, default: uuidv4 })
  declare _id: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  refreshTokenHash: string;
  @Prop({ type: String, required: true })
  clientId: string;
  @Prop({ type: Date, required: true })
  issuedAt: Date;
  @Prop({ type: Date, required: true })
  expiredAt: Date;
}

export const sessionSchema = SchemaFactory.createForClass(Session);
