import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddDpsCommand } from '../../../commands/dps/add-dps.command';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../ports/user-repository.interface';
import { BankAccount } from '../../../../domain/entities/bank-account.entity';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import { Dps } from '../../../../domain/entities/dps.entity';
import { BankAccountType } from '../../../../shared/consts/bankAccountType.enum';

@CommandHandler(AddDpsCommand)
export class AddDpsCommandHandler
  implements ICommandHandler<AddDpsCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
  ) {}
  async execute(command: AddDpsCommand): Promise<any> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const bankAccount = await this.bankAccountRepository.getItem({
        accountNo: command.accountNumber,
      });
      if (!bankAccount) {
        return CommandResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
      }
      const isAllValidOwners = command.dpsOwners.every((owner) =>
        bankAccount.accountHolders.some(
          (accountHolder) => accountHolder.userId == owner,
        ),
      );
      if (!isAllValidOwners) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_ACCOUNT_OWNER);
      }
      if (bankAccount.accountType == BankAccountType.Personal) {
        command.dpsOwners = [securityContext.userId];
      }
      const ownerUsers = await this.userRepository.getUsers(command.dpsOwners);
      const dps = new Dps(
        command.dpsName,
        command.accountNumber,
        command.monthlyDeposit,
        command.durationMonths,
        command.startDate,
        command.maturityDate,
        command.interestRate,
      );
      dps.addPdsInfo(securityContext.userId);
      dps.idsAllowedToRead = command.dpsOwners;
      dps.dpsOwners = ownerUsers.map((owner) => ({
        userId: owner.id,
        displayName: owner.displayName,
        amountPaid: 0,
        installmentDates: [],
      }));
      await this.dpsRepository.addDps(dps);
      return CommandResponse.success();
    } catch (err) {
      return CommandResponse.failure();
    }
  }
}
