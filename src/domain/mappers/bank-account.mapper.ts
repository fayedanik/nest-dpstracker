import { Injectable } from '@nestjs/common';
import { BankAccount } from '../entities/bank-account.entity';
import { BankAccountsResponseDto } from '../../presentation/dtos/response-dtos/bank-accounts-response.dto';

@Injectable()
export class BankAccountMapper {
  public static toDto(account: BankAccount): BankAccountsResponseDto {
    return {
      id: account.id,
      accountNo: account.accountNo,
      accountType: account.accountType,
      bankName: account.bankName,
      branchName: account.branchName,
      bankId: account.bankId,
      branchId: account.branchId,
      accountHolders: account.accountHolders,
    };
  }
}
