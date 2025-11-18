import { Module } from '@nestjs/common';
import { DashboardQueryController } from '../presentation/controllers/dashboard/dashboardQuery.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CoreModule } from './core.module';
import { BankAccountModule } from './bankAccount.module';
import { DpsModule } from './dps.module';
import { TransactionModule } from './transaction.module';
import { UserModule } from './user.module';

@Module({
  controllers: [DashboardQueryController],
  imports: [
    CqrsModule,
    UserModule,
    CoreModule,
    BankAccountModule,
    DpsModule,
    TransactionModule,
  ],
  exports: [],
  providers: [],
})
export class DashboardModule {}
