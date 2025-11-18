import { Injectable } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionResponseDto } from '../../presentation/dtos/response-dtos/transaction-response.dto';

@Injectable()
export class TransactionMapper {
  public static toDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      sourceAc: transaction.sourceAccount,
      senderUserId: transaction.sourceInfo.userId,
      senderDisplayName: transaction.sourceInfo.displayName,
      destAc: transaction.destinationAccount,
      amount: transaction.amount,
      note: transaction.note,
      paymentType: transaction.paymentType,
      transactionType: transaction.transactionType,
      dpsId: transaction.dpsId,
      transactionNo: transaction.transactionNumber,
      transactionDate: transaction.transactionDate,
      status: transaction.status,
    };
  }
}
