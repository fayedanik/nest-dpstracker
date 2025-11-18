import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MakePaymentCommand } from '../../../commands/Transaction/make-payment.command';
import { CommandResponse } from '../../../../shared/generic-class/command-response.class';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../ports/transaction.interface';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionTypeEnum } from '../../../../shared/consts/transactionType.enum';
import { Role } from '../../../../shared/consts/role.const';
import { TransactionStatusEnum } from '../../../../shared/consts/transactionStatus.enum';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../../../ports/user-repository.interface';
import { TransferMoneyCommand } from '../../../commands/Transaction/transfer-money.command';
import { User } from '../../../../domain/entities/user.entity';
import { BankAccountType } from '../../../../shared/consts/bankAccountType.enum';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';
import { PaymentTypeEnum } from '../../../../shared/consts/paymentType.enum';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';

@CommandHandler(MakePaymentCommand)
export class MakePaymentCommandHandler
  implements ICommandHandler<MakePaymentCommand, CommandResponse<boolean>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
  ) {}

  async execute(
    command: MakePaymentCommand,
  ): Promise<CommandResponse<boolean>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const user = await this.userRepository.getItem({
        id: securityContext.userId,
      });
      if (!user) {
        return CommandResponse.failure();
      }
      const sourceAccount = await this.bankAccountRepository.getItem({
        accountNo: command.sourceAc,
      });
      if (!sourceAccount) {
        return CommandResponse.failure(ErrorMessageConst.INVALID_ID);
      }
      if (sourceAccount.availableBalance < command.amount) {
        return CommandResponse.failure(ErrorMessageConst.NOT_ENOUGH_BALANCE);
      }
      const isAdmin = securityContext.roles.some(
        (x) => x == Role.Admin.toString(),
      );
      const idsAllowedToRead = [
        ...new Set([...(sourceAccount.idsAllowedToRead ?? [])]),
      ];
      const transaction = this.getTransactionPayload(
        command,
        user,
        sourceAccount.accountType,
        isAdmin,
        idsAllowedToRead,
      );
      const isAdded =
        await this.transactionRepository.addTransaction(transaction);
      if (isAdded && isAdmin) {
        await this.bankAccountRepository.update(sourceAccount.id, {
          availableBalance: Math.max(
            0,
            sourceAccount.availableBalance - command.amount,
          ),
        });
      }
      return isAdded ? CommandResponse.success() : CommandResponse.failure();
    } catch (e) {
      return CommandResponse.failure();
    }
  }

  private getTransactionPayload(
    command: MakePaymentCommand,
    user: User,
    accountType: BankAccountType,
    isAdmin: boolean,
    idsAllowedToRead: string[],
  ): Transaction {
    const transaction = new Transaction();
    transaction.transactionType = TransactionTypeEnum.Payment;
    transaction.sourceAccount = command.sourceAc;
    transaction.sourceInfo = {
      userId: user?.id,
      displayName: user?.displayName,
    };
    transaction.paymentType = command.paymentType;
    transaction.dpsId = command.dpsId;
    transaction.amount = command.amount;
    transaction.transactionDate = command.paymentDate;
    transaction.transactionNumber = command.transactionNumber;
    transaction.status =
      isAdmin || accountType == BankAccountType.Personal
        ? TransactionStatusEnum.Success
        : TransactionStatusEnum.Pending;
    transaction.note = command.note;
    transaction.idsAllowedToRead = idsAllowedToRead;
    return transaction;
  }
}
