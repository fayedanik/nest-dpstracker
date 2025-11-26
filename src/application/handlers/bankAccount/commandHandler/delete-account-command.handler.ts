import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAccountCommand } from '../../../commands/bankAccount/delete-account.command';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import { Role } from '../../../../shared/consts/role.const';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../ports/transaction.interface';

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler
  implements ICommandHandler<DeleteAccountCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    command: DeleteAccountCommand,
  ): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const account = await this.bankAccountRepository.getItem({
        id: command.id,
      });
      if (!account) {
        return CommandResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
      }
      if (
        securityContext.roles.includes(Role.Admin) ||
        account.idsAllowedToDelete?.includes(securityContext.userId)
      ) {
        const response = await this.bankAccountRepository.deleteAccount(
          command.id,
        );
        if (response) {
          await this.dpsRepository.deleteDpsByAccountNo(account.accountNo);
        }
        return response ? CommandResponse.success() : CommandResponse.failure();
      } else {
        return CommandResponse.failure(ErrorMessageConst.FORBIDDEN);
      }
    } catch (error) {
      return CommandResponse.failure();
    }
  }
}
