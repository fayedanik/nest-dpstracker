import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDtoMapper } from 'src/domain/mappers/user-dto.mapper';
import { SecurityContextProvider } from '../../core/SecurityContext/security-context-provider.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserResponseDto } from '../../presentation/dtos/response-dtos/user-response.dto';
import { ErrorMessageConst } from '../../shared/consts/error.const';
import { QueryResponse } from '../../shared/generic-class/query-response.class';
import { USER_REPOSITORY } from '../ports/user-repository.interface';
import { GetUserQuery } from '../queries/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, QueryResponse<UserResponseDto>>
{
  constructor(
    private readonly securityContextProvider: SecurityContextProvider,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}
  async execute(query: GetUserQuery): Promise<QueryResponse<UserResponseDto>> {
    try {
      const securityContext = this.securityContextProvider.getSecurityContext();
      const user = await this.userRepository.getItem({
        id: securityContext.userId,
      });
      if (user) {
        return QueryResponse.success(UserDtoMapper.toDto(user));
      }
      return QueryResponse.failure(ErrorMessageConst.CONTENT_NOT_FOUND);
    } catch (err) {
      return QueryResponse.failure(ErrorMessageConst.SOMETHING_WENT_WRONT);
    }
  }
}
