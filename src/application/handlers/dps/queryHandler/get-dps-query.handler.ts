import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDpsQuery } from '../../../queries/get-dps.query';
import {
  DPS_REPOSITORY,
  type IDpsRepository,
} from '../../../ports/dps.interface';
import { SecurityContextProvider } from '../../../../core/SecurityContext/security-context-provider.service';
import { Inject } from '@nestjs/common';
import { QueryResponse } from '../../../../shared/generic-class/query-response.class';
import { DpsResponseDto } from '../../../../presentation/dtos/response-dtos/dps-response.dto';
import { DpsMapper } from '../../../../domain/mappers/dps.mapper';

@QueryHandler(GetDpsQuery)
export class GetDpsQueryHandler implements IQueryHandler<GetDpsQuery> {
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(DPS_REPOSITORY)
    private readonly dpsRepository: IDpsRepository,
  ) {}
  async execute(query: GetDpsQuery): Promise<QueryResponse<DpsResponseDto[]>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      console.log(securityContext);
      const response = await this.dpsRepository.getDpsListByUserId(
        securityContext.userId,
      );
      const dto = response.map((dps) => DpsMapper.toDto(dps));
      return QueryResponse.success(dto);
    } catch (err) {
      console.log(err);
      return QueryResponse.failure();
    }
  }
}
