import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAccountCommand } from '../../../commands/bankAccount/update-account.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { BankAccount } from '../../../../domain/entities/bank-account.entity';
import { BankAccountType } from '../../../../shared/consts/bankAccountType.enum';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../ports/user-repository.interface';

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler
  implements ICommandHandler<UpdateAccountCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    command: UpdateAccountCommand,
  ): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const account = await this.bankAccountRepository.getItem({
        id: command.id,
      });
      if (!account) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_ID);
      }
      if (!account.idsAllowedToUpdate?.includes(securityContext.userId)) {
        return CommandResponse.failure(ErrorMessageConst.FORBIDDEN);
      }
      let accountHolderIds: string[] = [securityContext.userId];
      if (account.accountType != BankAccountType.Personal) {
        accountHolderIds = [
          ...new Set([...(command.userIds ?? []), securityContext.userId]),
        ];
      }
      const accountHolderUsers =
        await this.userRepository.getUsers(accountHolderIds);
      const accountHolders = accountHolderUsers.map((x) => ({
        userId: x.id,
        displayName: x.displayName,
      }));
      const update = {
        ...command,
        accountHolders: accountHolders,
        idsAllowedToRead: accountHolderIds,
        availableBalance:
          (account?.availableBalance ?? 0) +
          (account.accountType == BankAccountType.Personal
            ? Math.max(0, command.balance)
            : 0),
      } as Partial<BankAccount>;
      await this.bankAccountRepository.update(account.id, update);
      return CommandResponse.success();
    } catch (err) {
      return CommandResponse.failure();
    }
  }
}
