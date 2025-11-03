import { BankAccountType } from '../../../shared/consts/bankAccountType.enum';

export class AddAccountCommand {
  constructor(
    public readonly accountNo: string,
    public readonly bankName: string,
    public readonly bankId: string,
    public readonly branchName: string,
    public readonly branchId: string,
    public readonly accountType: BankAccountType,
    public readonly userIds: string[],
  ) {}
}
