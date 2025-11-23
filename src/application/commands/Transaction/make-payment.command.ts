import { PaymentTypeEnum } from '../../../shared/consts/paymentType.enum';

export class MakePaymentCommand {
  constructor(
    public sourceAc: string,
    public paymentType: PaymentTypeEnum,
    public dpsId: string,
    public amount: number,
    public transactionNumber: string,
    public paymentDate: Date,
    public note: string,
  ) {}
}
