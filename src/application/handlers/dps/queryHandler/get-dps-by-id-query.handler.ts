import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetDpsByIdQuery } from '../../../queries/get-dps-by-id.query';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';
import { QueryResponse } from '../../../../shared/generic-class/query-response.class';
import { DpsMapper } from '../../../../domain/mappers/dps.mapper';
import { Role } from '../../../../shared/consts/role.const';
import { ErrorMessageConst } from '../../../../shared/consts/error.const';

@QueryHandler(GetDpsByIdQuery)
export class GetDpsByIdQueryHandler implements IQueryHandler<GetDpsByIdQuery> {
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
  ) {}
  async execute(query: GetDpsByIdQuery): Promise<any> {
    try {
      console.log(query.dpsId);
      const securityContext = this.securityContextProvider.getSecurityContext();
      const result = await this.dpsRepository.getItem({ id: query.dpsId });
      if (!result) {
        return QueryResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
      }
      const isAdmin = securityContext.roles.includes(Role.Admin);
      return QueryResponse.success(
        DpsMapper.toDto(result, securityContext.userId, isAdmin),
      );
    } catch (e) {
      return QueryResponse.failure();
    }
  }
}
