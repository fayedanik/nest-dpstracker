import { IMapper } from '../../domain/common/maper.interface';
import { BankAccount } from '../../domain/entities/bank-account.entity';
import { BankAccountDocument } from '../schemas/bankAccount.schema';
import { FilterQuery } from 'mongoose';

export class BankAccountMapper
  implements IMapper<BankAccount, BankAccountDocument>
{
  toDomain(raw: BankAccountDocument): BankAccount {
    return {
      ...raw,
      id: raw._id.toString(),
    };
  }

  toPersistence(domain: BankAccount): BankAccountDocument {
    return {
      _id: domain.id.toString(),
      ...domain,
    } as BankAccountDocument;
  }

  toPersistFilter(
    domain?: FilterQuery<Partial<BankAccount>>,
  ): FilterQuery<Partial<BankAccountDocument>> {
    const filter: FilterQuery<Partial<BankAccountDocument>> = {};
    if (!domain) return filter;
    if (domain.id) filter._id = domain.id;
    if (domain.bankId) filter.bankId = domain.bankId;
    if (domain.branchId) filter.branchId = domain.branchId;
    if (domain.accountHolders)
      filter.accountHolderUserIds = domain.accountHolderUserIds;
    return filter;
  }

  toPersistUpdate(domain: Partial<BankAccount>): Partial<BankAccountDocument> {
    const update: Partial<BankAccountDocument> = {};
    if (domain.accountNo) update.accountNo = domain.accountNo;
    if (domain.bankId) update.bankId = domain.bankId;
    if (domain.branchId) update.branchId = domain.branchId;
    if (domain.branchName) update.branchName = domain.branchName;
    if (domain.bankName) update.bankName = domain.bankName;
    if (domain.accountHolders) update.accountHolders = domain.accountHolders;
    if (domain.accountType) update.accountType = domain.accountType;
    return update;
  }
}
