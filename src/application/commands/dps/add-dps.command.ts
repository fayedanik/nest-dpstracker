export class AddDpsCommand {
  constructor(
    public accountNumber: string,
    public monthlyDeposit: number,
    public durationMonths: number,
    public startDate: Date,
    public maturityDate: Date,
    public interestRate: number,
    public dpsOwners: string[],
  ) {}
}
