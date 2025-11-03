import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DpsDocument, DpsSchema } from '../infrastructure/schemas/dps.schema';
import { DpsCommandController } from '../presentation/controllers/dps/dpsCommand.controller';
import { DpsQueryController } from '../presentation/controllers/dps/dpsQuery.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './user.module';
import { DPS_REPOSITORY } from '../application/ports/dps.interface';
import { DpsRepository } from '../infrastructure/repositories/dps.repository';
import { CoreModule } from './core.module';
import { DpsMapper } from '../infrastructure/mappers/dps.mapper';
import { BankAccountModule } from './bankAccount.module';
import { AddDpsCommandHandler } from '../application/handlers/dps/commandHandler/add-dps-command.handler';
import { DeleteAccountCommandHandler } from '../application/handlers/bankAccount/commandHandler/delete-account-command.handler';
import { GetDpsQueryHandler } from '../application/handlers/dps/queryHandler/get-dps-query.handler';

@Module({
  controllers: [DpsCommandController, DpsQueryController],
  imports: [
    CqrsModule,
    CoreModule,
    UserModule,
    BankAccountModule,
    MongooseModule.forFeature([
      {
        name: DpsDocument.name,
        schema: DpsSchema,
      },
    ]),
  ],
  exports: [],
  providers: [
    AddDpsCommandHandler,
    DeleteAccountCommandHandler,
    GetDpsQueryHandler,
    DpsMapper,
    {
      provide: DPS_REPOSITORY,
      useClass: DpsRepository,
    },
  ],
})
export class DpsModule {
  constructor() {}
}
