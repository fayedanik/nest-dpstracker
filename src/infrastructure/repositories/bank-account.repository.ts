import { IBankAccountRepository } from '../../application/ports/bank-account-repository.interface';
import { GenericRepository } from './generic.repository';
import { BankAccount } from '../../domain/entities/bank-account.entity';
import { BankAccountDocument } from '../schemas/bankAccount.schema';
import { Model, Promise } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BankAccountMapper } from '../mappers/bank-account.mapper';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';

@Injectable()
export class BankAccountRepository
  extends GenericRepository<BankAccount, BankAccountDocument>
  implements IBankAccountRepository
{
  constructor(
    @InjectModel(BankAccountDocument.name)
    private readonly bankAccountModel: Model<BankAccountDocument>,
    private readonly bankAccountMapper: BankAccountMapper,
    protected readonly securityContextProvider: SecurityContextProvider,
  ) {
    super(bankAccountModel, bankAccountMapper, securityContextProvider);
  }

  async getAccountsByUserId(userId: string): Promise<BankAccount[]> {
    try {
      const result = await this.bankAccountModel
        .find({
          'accountHolders.userId': userId,
        })
        .exec();
      return result.map((x) => this.bankAccountMapper.toDomain(x.toObject()));
    } catch (err) {
      return [];
    }
  }

  async addAccount(account: BankAccount): Promise<boolean> {
    try {
      const res = await this.insert(account);
      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteAccount(itemId: string): Promise<boolean> {
    try {
      const res = await this.bankAccountModel.deleteOne({ _id: itemId }).exec();
      return true;
    } catch (err) {
      return false;
    }
  }
}
