import { UpdateAccountCommandDto } from '../../../presentation/dtos/comand-dtos/update-account-command.dto';
import { BankAccountType } from '../../../shared/consts/bankAccountType.const';

export class UpdateAccountCommand {
  id: string;
  accountNo: string;
  bankName: string;
  bankId: string;
  branchName: string;
  branchId: string;
  accountType: BankAccountType;
  userIds: string[];

  constructor(dto: UpdateAccountCommandDto) {
    this.id = dto.id;
    this.accountNo = dto?.accountNo;
    this.bankName = dto?.bankName;
    this.bankId = dto?.bankId;
    this.branchName = dto?.branchName;
    this.branchId = dto?.branchId;
    this.accountType = dto?.accountType;
    this.userIds = dto?.userIds;
  }
}
