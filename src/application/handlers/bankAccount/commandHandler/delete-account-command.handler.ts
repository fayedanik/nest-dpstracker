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

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler
  implements ICommandHandler<DeleteAccountCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
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
        !securityContext.roles.includes(Role.Admin) ||
        !account.idsAllowedToDelete?.includes(securityContext.userId)
      ) {
        return CommandResponse.failure(ErrorMessageConst.FORBIDDEN);
      }
      const response = await this.bankAccountRepository.deleteAccount(
        command.id,
      );
      return CommandResponse.success(response);
    } catch (error) {
      return CommandResponse.failure();
    }
  }
}
