import { GenericRepository } from './generic.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionDocument } from '../schemas/transaction.schema';
import { ITransactionRepository } from '../../application/ports/transaction.interface';
import { FilterQuery, Model, Promise } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';

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
}
