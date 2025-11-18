import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStatsQuery } from '../queries/get-stats.query';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';

@QueryHandler(GetStatsQuery)
export class GetStatsQueryHandler implements IQueryHandler<GetStatsQuery> {
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
  ) {}
  async execute(query: GetStatsQuery): Promise<any> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
    } catch (e) {}
  }
}
