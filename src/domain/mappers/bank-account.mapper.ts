import { Injectable } from '@nestjs/common';
import { BankAccount } from '../entities/bank-account.entity';
import { BankAccountsResponseDto } from '../../presentation/dtos/response-dtos/bank-accounts-response.dto';

@Injectable()
export class BankAccountMapper {
  public static toDto(
    account: BankAccount,
    loggedInUserId: string,
    isAdmin: boolean,
  ): BankAccountsResponseDto {
    return {
      id: account.id,
      accountNo: account.accountNo,
      accountType: account.accountType,
      bankName: account.bankName,
      branchName: account.branchName,
      bankId: account.bankId,
      branchId: account.branchId,
      accountHolders: account.accountHolders,
      balance: account.availableBalance,
      canUpdate:
        account.idsAllowedToUpdate?.includes(loggedInUserId) ?? isAdmin,
      canDelete:
        account.idsAllowedToDelete?.includes(loggedInUserId) ?? isAdmin,
    };
  }
}
