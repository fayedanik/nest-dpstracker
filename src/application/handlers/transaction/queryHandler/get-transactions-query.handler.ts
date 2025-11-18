import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsQuery } from '../../../queries/get-transactions.query';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  type ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../../../ports/transaction.interface';
import { QueryResponse } from '../../../../shared/generic-class/query-response.class';
import { TransactionMapper } from '../../../../domain/mappers/transaction.mapper';

@QueryHandler(GetTransactionsQuery)
export class GetTransactionsQueryHandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(query: GetTransactionsQuery): Promise<QueryResponse<any>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const response = await this.transactionRepository.getTransactions(
        query.type,
        securityContext.userId,
        query.pageIndex,
        query.pageLimit,
      );
      const count = await this.transactionRepository.getCount({
        transactionType: query.type,
      });
      const dto = response.map((transaction) =>
        TransactionMapper.toDto(transaction),
      );
      return QueryResponse.success(dto, '', count);
    } catch (err) {
      console.log(err);
      return QueryResponse.failure();
    }
  }
}
