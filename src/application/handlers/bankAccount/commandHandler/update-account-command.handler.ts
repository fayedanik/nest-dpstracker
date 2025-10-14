import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAccountCommand } from '../../../commands/update-account.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { BankAccount } from '../../../../domain/entities/bank-account.entity';
import { BankAccountType } from '../../../../shared/consts/bankAccountType.const';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler
  implements ICommandHandler<UpdateAccountCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
  ) {}
  async execute(
    command: UpdateAccountCommand,
  ): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const account = await this.bankAccountRepository.getItem({
        _id: command.id,
      });
      if (!account) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_ID);
      }
      await this.bankAccountRepository.update(
        account.id,
        this.GetUpdatedEntityFromCommand(
          command,
          account,
          securityContext.userId,
        ),
      );
      return CommandResponse.success();
    } catch (err) {
      return CommandResponse.failure();
    }
  }

  private GetUpdatedEntityFromCommand(
    command: UpdateAccountCommand,
    account: BankAccount,
    loggedInUserId: string,
  ): Partial<BankAccount> {
    if (
      command.accountType.toString() === BankAccountType.Personal.toString()
    ) {
      account.accountHolderUserIds = [loggedInUserId];
    } else {
      account.accountHolderUserIds = [
        ...new Set(...(command.userIds ?? []), loggedInUserId.toString()),
      ];
    }
    return {
      ...account,
      ...command,
      accountHolderUserIds: account.accountHolderUserIds,
    };
  }
}
