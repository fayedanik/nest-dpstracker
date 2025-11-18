import { CommandBus } from '@nestjs/cqrs';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransactionTypeEnum } from '../../../shared/consts/transactionType.enum';

export class TransferMoneyCommand {
  constructor(
    public sourceAc: string,
    public beneficiaryAc: string,
    public amount: number,
    public transactionDate: Date,
    public transactionNumber: string,
    public note: string,
  ) {}
}
