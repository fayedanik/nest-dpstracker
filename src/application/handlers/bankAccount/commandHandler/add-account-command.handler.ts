import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddAccountCommand } from '../../../commands/bankAccount/add-account.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BankAccount } from '../../../../domain/entities/bank-account.entity';
import { BankAccountType } from '../../../../shared/consts/bankAccountType.enum';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../ports/user-repository.interface';

@CommandHandler(AddAccountCommand)
export class AddAccountCommandHandler
  implements ICommandHandler<AddAccountCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(command: AddAccountCommand): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const accountHolderIds = [
        ...new Set([...(command.userIds ?? []), securityContext.userId]),
      ];
      const account = new BankAccount(
        command.accountNo,
        command.bankName,
        command.bankId,
        command.branchName,
        command.branchId,
        command.accountType,
      );
      account.accountHolders = (
        await this.userRepository.getUsers(accountHolderIds)
      ).map((x) => ({ userId: x.id, displayName: x.displayName }));
      await this.bankAccountRepository.addAccount(account);
      return CommandResponse.success();
    } catch (err) {
      return CommandResponse.failure();
    }
  }
}
