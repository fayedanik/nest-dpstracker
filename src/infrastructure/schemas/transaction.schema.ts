import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TransactionTypeEnum } from '../../shared/consts/transactionType.enum';
import { BaseSchema } from './base.schema';
import { TransactionStatusEnum } from '../../shared/consts/transactionStatus.enum';

export class SourecInfo {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  displayName: string;
}
@Schema({ collection: 'transactions', timestamps: true, versionKey: false })
export class TransactionDocument extends BaseSchema {
  @Prop({ type: String, required: true })
  sourceAccount: string;

  @Prop({ type: String })
  destinationAccount: string;

  @Prop({ type: SourecInfo, required: true })
  sourceInfo: SourecInfo;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({
    type: String,
    enum: Object.values(TransactionTypeEnum),
    required: true,
  })
  transactionType: TransactionTypeEnum;

  @Prop({ type: String })
  paymentType: string;

  @Prop({ type: String })
  dpsId: string;

  @Prop({ type: String, required: true })
  transactionNumber: string;

  @Prop({ type: Date, required: true })
  transactionDate: Date;

  @Prop({
    type: String,
    enum: Object.values(TransactionStatusEnum),
    required: true,
    default: TransactionStatusEnum.Pending,
  })
  status: string;

  @Prop({ type: String, required: true })
  note: string;
}

export const TransactionSchema =
  SchemaFactory.createForClass(TransactionDocument);
