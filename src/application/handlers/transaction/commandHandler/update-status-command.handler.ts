import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStatusCommand } from '../../../commands/Transaction/update-status.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { Inject } from '@nestjs/common';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../ports/transaction.interface';
import { TransactionStatusEnum } from '../../../../shared/consts/transactionStatus.enum';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { TransactionTypeEnum } from '../../../../shared/consts/transactionType.enum';
import { BankAccount } from '../../../../domain/entities/bank-account.entity';

@CommandHandler(UpdateStatusCommand)
export class UpdateStatusCommandHandler
  implements ICommandHandler<UpdateStatusCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
  ) {}

  async execute(
    command: UpdateStatusCommand,
  ): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const transaction = await this.transactionRepository.getItem({
        id: command.transactionId,
      });
      if (!transaction) {
        return CommandResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
      }
      const sourceAccount = await this.bankAccountRepository.getItem({
        accountNo: transaction.sourceAccount,
      });
      console.log(sourceAccount);
      if (!sourceAccount) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_TRANSACTION);
      }
      if (sourceAccount.availableBalance < transaction.amount) {
        return CommandResponse.failure(ErrorMessageConst.NOT_ENOUGH_BALANCE);
      }
      let destinationAccount: BankAccount | null = null;
      if (transaction.transactionType == TransactionTypeEnum.TransferMoney) {
        destinationAccount = await this.bankAccountRepository.getItem({
          accountNo: transaction.destinationAccount,
        });
        if (!destinationAccount) {
          return CommandResponse.failure(ErrorMessageConst.INVALID_TRANSACTION);
        }
      }

      transaction.status = TransactionStatusEnum.Success;
      transaction.lastUpdatedBy = securityContext.userId;

      const result = await this.transactionRepository.update(
        command.transactionId,
        transaction,
      );
      if (result) {
        await this.bankAccountRepository.update(sourceAccount.id, {
          availableBalance: Math.max(
            0,
            sourceAccount.availableBalance - transaction.amount,
          ),
        });
        if (
          destinationAccount &&
          transaction.transactionType == TransactionTypeEnum.TransferMoney
        ) {
          await this.bankAccountRepository.update(destinationAccount.id, {
            availableBalance:
              destinationAccount.availableBalance + transaction.amount,
          });
        }
      }
      return result ? CommandResponse.success() : CommandResponse.failure();
    } catch (e) {
      return CommandResponse.failure();
    }
  }
}
