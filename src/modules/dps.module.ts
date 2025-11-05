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
import { GetDpsQueryHandler } from '../application/handlers/dps/queryHandler/get-dps-query.handler';
import { DeleteDpsCommandHandler } from '../application/handlers/dps/commandHandler/delete-dps-command.handler';

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
    DeleteDpsCommandHandler,
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
