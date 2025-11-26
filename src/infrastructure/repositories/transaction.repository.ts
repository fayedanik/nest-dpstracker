import { GenericRepository } from './generic.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionDocument } from '../schemas/transaction.schema';
import { ITransactionRepository } from '../../application/ports/transaction.interface';
import { FilterQuery, Model, Promise } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';
import { TransactionStatusEnum } from '../../shared/consts/transactionStatus.enum';

export class TransactionRepository
  extends GenericRepository<Transaction, TransactionDocument>
  implements ITransactionRepository
{
  constructor(
    @InjectModel(TransactionDocument.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly transactionMapper: TransactionMapper,
    protected readonly securityContextProvider: SecurityContextProvider,
  ) {
    super(transactionModel, transactionMapper, securityContextProvider);
  }

  async getTransactions(
    type: string,
    userId: string,
    pageIndex?: number,
    pageLimit?: number,
  ): Promise<Transaction[]> {
    try {
      const filter: FilterQuery<Partial<Transaction>> = {};
      if (type) {
        filter.transactionType = type;
      }
      return this.getItems(
        filter,
        { transactionDate: -1 },
        pageIndex ?? 0,
        pageLimit ?? 100,
      );
    } catch (e) {
      return [];
    }
  }

  async addTransaction(transaction: Transaction): Promise<boolean> {
    try {
      const res = await this.insert(transaction);
      return !!res;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getUserShareOfAccount(
    userId: string,
    accountNo: string,
  ): Promise<number> {
    const result = await this.transactionModel.aggregate([
      {
        $match: {
          'sourceInfo.userId': userId,
          destinationAccount: accountNo,
          status: TransactionStatusEnum.Success,
        },
      },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);
    return result[0]?.totalAmount ?? 0;
  }

  async deleteTransactionByAccountNo(accountNo: string): Promise<boolean> {
    try {
      const response = await this.transactionModel.deleteMany({
        $or: [{ sourceAccount: accountNo }, { destinationAccount: accountNo }],
      });
      return response.acknowledged;
    } catch (e) {
      return false;
    }
  }
}
