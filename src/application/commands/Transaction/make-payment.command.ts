export class MakePaymentCommand {
  constructor(
    public sourceAc: string,
    public paymentType: string,
    public dpsId: string,
    public amount: number,
    public transactionNumber: string,
    public paymentDate: Date,
    public note: string,
  ) {}
}
