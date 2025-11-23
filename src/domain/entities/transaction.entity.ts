import { TransactionTypeEnum } from '../../shared/consts/transactionType.enum';
import { EntityBase } from './entity-base.entity';
import { randomUUID } from 'crypto';
import { PaymentTypeEnum } from '../../shared/consts/paymentType.enum';
export class Transaction extends EntityBase {
  sourceAccount: string;
  destinationAccount: string;
  amount: number;
  note: string;
  paymentType: PaymentTypeEnum;
  transactionType: TransactionTypeEnum;
  dpsId: string;
  transactionNumber: string;
  transactionDate: Date;
  status: string;
  sourceInfo: SourceInfo;
  constructor() {
    super(randomUUID());
  }
}

export class SourceInfo {
  userId: string;
  displayName: string;
}
