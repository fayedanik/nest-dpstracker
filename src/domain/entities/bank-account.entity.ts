import { EntityBase } from './entity-base.entity';
import { v4 as uuidv4 } from 'uuid';

export class BankAccount extends EntityBase {
  accountHolders: AcccountHolder[];
  constructor(
    public accountNo: string,
    public bankName: string,
    public bankId: string,
    public branchName: string,
    public branchId: string,
    public accountType: string,
  ) {
    super(uuidv4({}));
    this.accountHolders = [];
  }
}

export class AcccountHolder {
  userId: string;
  displayName: string;
}
