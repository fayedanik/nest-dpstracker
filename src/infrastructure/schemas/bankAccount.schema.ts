import { BaseSchema } from './base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BankAccountType } from '../../shared/consts/bankAccountType.const';

export class AccountHolder {
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: [String], required: true })
  displayName: string;
}

@Schema({ collection: 'bankAccounts', timestamps: true, versionKey: false })
export class BankAccountDocument extends BaseSchema {
  @Prop({ type: String, required: true })
  accountNo: string;

  @Prop({ type: String, required: true })
  bankName: string;

  @Prop({ type: String, required: true })
  bankId: string;

  @Prop({ type: String, required: true })
  branchName: string;

  @Prop({ type: String, required: true })
  branchId: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BankAccountType),
    default: BankAccountType.Personal,
  })
  accountType: string;

  @Prop({ type: [AccountHolder], required: true })
  accountHolders: AccountHolder[];
}

export const BankAccountSchema =
  SchemaFactory.createForClass(BankAccountDocument);
