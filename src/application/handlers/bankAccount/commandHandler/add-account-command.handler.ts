import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddAccountCommand } from '../../../commands/add-account.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BankAccount } from '../../../../domain/entities/bank-account.entity';
import { BankAccountType } from '../../../../shared/consts/bankAccountType.const';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';

@CommandHandler(AddAccountCommand)
export class AddAccountCommandHandler
  implements ICommandHandler<AddAccountCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
  ) {}
  async execute(command: AddAccountCommand): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const account = new BankAccount(
        command.accountNo,
        command.bankName,
        command.bankId,
        command.branchName,
        command.branchId,
        command.accountType,
      );
      if (
        command.accountType.toString() === BankAccountType.Personal.toString()
      ) {
        account.accountHolderUserIds = [securityContext.userId];
      } else {
        account.accountHolderUserIds = [
          ...new Set(
            ...(command.userIds ?? []),
            securityContext.userId.toString(),
          ),
        ];
      }
      await this.bankAccountRepository.addAccount(account);
      return CommandResponse.success();
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ErrorMessageConst.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: err },
      );
    }
  }
}
