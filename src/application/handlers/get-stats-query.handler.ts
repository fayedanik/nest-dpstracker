import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStatsQuery } from '../queries/get-stats.query';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../ports/bank-account-repository.interface';
import { QueryResponse } from '../../shared/generic-class/query-response.class';
import { DPS_REPOSITORY, type IDpsRepository } from '../ports/dps.interface';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../ports/transaction.interface';
import { DashboardStatsResponseDto } from '../../presentation/dtos/response-dtos/dashboard-stats-response.dto';

@QueryHandler(GetStatsQuery)
export class GetStatsQueryHandler implements IQueryHandler<GetStatsQuery> {
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}
  async execute(
    query: GetStatsQuery,
  ): Promise<QueryResponse<DashboardStatsResponseDto>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const banks = await this.bankAccountRepository.getAccountsByUserId(
        securityContext.userId,
      );
      const accounts: any = [];
      for (const bank of banks) {
        const amountShare =
          await this.transactionRepository.getUserShareOfAccount(
            securityContext.userId,
            bank.accountNo,
          );
        accounts.push({
          id: bank.id,
          accountNo: bank.accountNo,
          amountShare: amountShare,
        });
      }
      return QueryResponse.success({ accounts: accounts });
    } catch (e) {
      return QueryResponse.failure();
    }
  }
}
