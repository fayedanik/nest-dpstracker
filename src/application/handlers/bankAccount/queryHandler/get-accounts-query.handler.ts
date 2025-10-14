import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetAccountsQuery } from '../../../queries/get-accounts.query';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  BANK_ACCOUNT_REPOSITORY,
  type IBankAccountRepository,
} from '../../../ports/bank-account-repository.interface';
import { BankAccountMapper } from '../../../../domain/mappers/bank-account.mapper';
import { BankAccountsResponseDto } from '../../../../presentation/dtos/response-dtos/bank-accounts-response.dto';
import { QueryResponse } from '../../../../shared/generic-class/query-response.class';
import { UserResponseDto } from '../../../../presentation/dtos/response-dtos/user-response.dto';

@QueryHandler(GetAccountsQuery)
export class GetAccountsQueryHandler
  implements IQueryHandler<GetAccountsQuery>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(BANK_ACCOUNT_REPOSITORY)
    private readonly bankAccountRepository: IBankAccountRepository,
  ) {}
  async execute(
    query: GetAccountsQuery,
  ): Promise<QueryResponse<BankAccountsResponseDto[]>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const response = await this.bankAccountRepository.getAccountsByUserId(
        securityContext.userId,
      );
      const dto = response.map((account) => BankAccountMapper.toDto(account));
      return QueryResponse.success(dto);
    } catch (err) {
      return QueryResponse.failure();
    }
  }
}
