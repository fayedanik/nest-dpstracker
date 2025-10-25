import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAccountCommand } from '../../../commands/bankAccount/delete-account.command';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';

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
      const response = await this.bankAccountRepository.deleteAccount(
        command.id,
      );
      return CommandResponse.success(response);
    } catch (error) {
      return CommandResponse.failure();
    }
  }
}
