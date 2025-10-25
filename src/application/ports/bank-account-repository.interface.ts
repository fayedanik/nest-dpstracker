import { BankAccount } from '../../domain/entities/bank-account.entity';
import { IRepository } from './generic-repository.interface';

export interface IBankAccountRepository extends IRepository<BankAccount> {
  addAccount(account: BankAccount): Promise<boolean>;
  deleteAccount(itemId: string): Promise<boolean>;
  getAccountsByUserId(userId: string): Promise<BankAccount[]>;
}

export const BANK_ACCOUNT_REPOSITORY = Symbol('BANK_ACCOUNT_REPOSITORY');
