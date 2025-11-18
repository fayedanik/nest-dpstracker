export class UpdateDpsCommand {
  constructor(
    public dpsId: string,
    public ownerId: string,
    public paymentDate: Date,
  ) {}
}
