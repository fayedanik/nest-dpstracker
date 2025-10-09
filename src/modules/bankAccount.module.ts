import { Module } from '@nestjs/common';
import { BankAccountCommandController } from '../presentation/controllers/bankAccount/bankAccountCommand.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from './core.module';
import { AddAccountCommandHandler } from '../application/handlers/bankAccount/commandHandler/add-account-command.handler';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankAccountDocument,
  BankAccountSchema,
} from '../infrastructure/schemas/bankAccount.schema';
import { BANK_ACCOUNT_REPOSITORY } from '../application/ports/bank-account-repository.interface';
import { BankAccountRepository } from '../infrastructure/repositories/bank-account.repository';
import { BankAccountMapper } from '../infrastructure/mappers/bank-account.mapper';

@Module({
  controllers: [BankAccountCommandController],
  imports: [
    CoreModule,
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: BankAccountDocument.name,
        schema: BankAccountSchema,
      },
    ]),
  ],
  exports: [],
  providers: [
    AddAccountCommandHandler,
    BankAccountMapper,
    {
      provide: BANK_ACCOUNT_REPOSITORY,
      useClass: BankAccountRepository,
    },
  ],
})
export class BankAccountModule {}
