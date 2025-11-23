import { BaseSchema } from './base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DpsStatusType } from '../../shared/consts/dpsStatusType.enum';

export class DpsOwners {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  displayName: string;
  @Prop({ type: Number, required: true, default: 0 })
  amountPaid: number;
  @Prop({ type: [Date], required: true, default: [] })
  installmentDates: Date[];
}

@Schema({ collection: 'dpsSchemes', timestamps: true, versionKey: false })
export class DpsDocument extends BaseSchema {
  @Prop({ type: [DpsOwners], required: true, default: [] })
  dpsOwners: DpsOwners[];
  @Prop({ type: String, required: true })
  dpsName: string;
  @Prop({ type: String, required: true })
  accountNumber: string;
  @Prop({ type: Number, required: true })
  monthlyDeposit: number;
  @Prop({ type: Number, required: true })
  durationMonths: number;
  @Prop({ type: Date, required: true })
  startDate: Date;
  @Prop({ type: Date, required: true })
  maturityDate: Date;
  @Prop({ type: Number, required: true, default: 0 })
  interestRate: number;
  @Prop({ type: Number, required: true, default: 0 })
  totalDeposit: number;
  @Prop({ type: [Date], default: [] })
  installmentDates: Date[];
  @Prop({
    type: String,
    required: true,
    enum: Object.values(DpsStatusType),
    default: DpsStatusType.Active,
  })
  status: string;
}

export const DpsSchema = SchemaFactory.createForClass(DpsDocument);
