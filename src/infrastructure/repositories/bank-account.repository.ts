import { IBankAccountRepository } from '../../application/ports/bank-account-repository.interface';
import { GenericRepository } from './generic.repository';
import { BankAccount } from '../../domain/entities/bank-account.entity';
import { BankAccountDocument } from '../schemas/bankAccount.schema';
import { Model, Promise } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BankAccountMapper } from '../mappers/bank-account.mapper';

@Injectable()
export class BankAccountRepository
  extends GenericRepository<BankAccount, BankAccountDocument>
  implements IBankAccountRepository
{
  constructor(
    @InjectModel(BankAccountDocument.name)
    private readonly bankAccountModel: Model<BankAccountDocument>,
    private readonly bankAccountMapper: BankAccountMapper,
  ) {
    super(bankAccountModel, bankAccountMapper);
  }

  async addAccount(account: BankAccount): Promise<boolean> {
    try {
      const res = await this.insert({ ...account });
      return true;
    } catch (err) {
      return false;
    }
  }
}
