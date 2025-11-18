import { Module } from '@nestjs/common';
import { MakePaymentCommandHandler } from '../application/handlers/transaction/commandHandler/make-payment-command.handler';
import { TransferMoneyCommandHandler } from '../application/handlers/transaction/commandHandler/transfer-money-command.handler';
import { GetTransactionsQueryHandler } from '../application/handlers/transaction/queryHandler/get-transactions-query.handler';
import { TransactionCommandController } from '../presentation/controllers/transaction/transactionCommand.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from './core.module';
import { UserModule } from './user.module';
import { BankAccountModule } from './bankAccount.module';
import { DpsModule } from './dps.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionDocument,
  TransactionSchema,
} from '../infrastructure/schemas/transaction.schema';
import { TRANSACTION_REPOSITORY } from '../application/ports/transaction.interface';
import { TransactionRepository } from '../infrastructure/repositories/transaction.repository';
import { TransactionMapper } from '../infrastructure/mappers/transaction.mapper';
import { TransactionQueryController } from '../presentation/controllers/transaction/transactionQuery.controller';
import { UpdateStatusCommandHandler } from '../application/handlers/transaction/commandHandler/update-status-command.handler';

@Module({
  controllers: [TransactionCommandController, TransactionQueryController],
  imports: [
    CqrsModule,
    CoreModule,
    MongooseModule.forFeature([
      {
        name: TransactionDocument.name,
        schema: TransactionSchema,
      },
    ]),
    UserModule,
    BankAccountModule,
    DpsModule,
  ],
  exports: [TRANSACTION_REPOSITORY],
  providers: [
    MakePaymentCommandHandler,
    TransferMoneyCommandHandler,
    UpdateStatusCommandHandler,
    GetTransactionsQueryHandler,
    TransactionMapper,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
  ],
})
export class TransactionModule {}
