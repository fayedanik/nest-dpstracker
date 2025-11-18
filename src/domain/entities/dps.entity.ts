import { EntityBase } from './entity-base.entity';
import { randomUUID } from 'crypto';
import { Prop } from '@nestjs/mongoose';
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
    super(randomUUID());
  }
}

export class DpsOwners {
  userId: string;
  displayName: string;
  amountPaid: number = 0;
  installmentDates: Date[] = [];
}
