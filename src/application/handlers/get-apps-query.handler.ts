import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';
import { GetAppsQuery } from '../queries/get-apps.query';

@QueryHandler(GetAppsQuery)
export class GetAppsQueryHandler
  implements IQueryHandler<GetAppsQuery, unknown>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
  ) {}
  execute(query: GetAppsQuery): Promise<unknown> {
    console.log(this.securityContextProvider.getSecurityContext());
    return Promise.resolve('App list');
  }
}
