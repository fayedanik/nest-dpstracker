import { EntityBase } from './entity-base.entity';
import { randomUUID } from 'crypto';
import { BankAccountType } from '../../shared/consts/bankAccountType.enum';

export class BankAccount extends EntityBase {
  accountHolders: AccountHolder[];
  constructor(
    public accountNo: string,
    public bankName: string,
    public bankId: string,
    public branchName: string,
    public branchId: string,
    public accountType: BankAccountType,
    public availableBalance: number,
  ) {
    super(randomUUID());
    this.accountHolders = [];
  }
}

export class AccountHolder {
  userId: string;
  displayName: string;
}
