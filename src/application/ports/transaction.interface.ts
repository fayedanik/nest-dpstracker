import { IRepository } from './generic-repository.interface';
import { Transaction } from '../../domain/entities/transaction.entity';

export interface ITransactionRepository extends IRepository<Transaction> {
  addTransaction(transaction: Transaction): Promise<boolean>;
  getTransactions(
    type: string,
    userId: string,
    pageIndex?: number,
    pageLimit?: number,
  ): Promise<Transaction[]>;
  getUserShareOfAccount(userId: string, accountNo: string): Promise<number>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');
