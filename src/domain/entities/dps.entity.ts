import { EntityBase } from './entity-base.entity';
import { v4 as uuidv4 } from 'uuid';
export class Dps extends EntityBase {
  status: string;
  dpsOwners: DpsOwners[];
  constructor(
    public dpsName: string,
    public accountNumber: string,
    public monthlyDeposit: number,
    public durationMonths: number,
    public startDate: Date,
    public maturityDate: Date,
    public interestRate: number,
    public totalDeposit: number,
  ) {
    super(uuidv4({}));
  }
}

export class DpsOwners {
  userId: string;
  displayName: string;
}
