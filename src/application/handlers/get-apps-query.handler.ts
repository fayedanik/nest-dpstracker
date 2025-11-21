import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';
import { GetAppsQuery } from '../queries/get-apps.query';
import { Role } from '../../shared/consts/role.const';

@QueryHandler(GetAppsQuery)
export class GetAppsQueryHandler
  implements IQueryHandler<GetAppsQuery, unknown>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
  ) {}
  execute(query: GetAppsQuery): Promise<unknown> {
    const securityContext = this.securityContextProvider.getSecurityContext();
    const userAppList = ['dashboard', 'transaction', 'dps', 'accounts'];
    const adminAppList = [
      'dashboard',
      'transaction',
      'dps',
      'accounts',
      'userList',
    ];
    return securityContext.roles.includes(Role.Admin)
      ? Promise.resolve(adminAppList)
      : Promise.resolve(userAppList);
  }
}
