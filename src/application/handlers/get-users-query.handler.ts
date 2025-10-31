import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDtoMapper } from 'src/domain/mappers/user-dto.mapper';
import { QueryResponse } from 'src/shared/generic-class/query-response.class';
import { GetUserResponseDto } from '../../presentation/dtos/response-dtos/get-users-response.dto';
import { ErrorMessageConst } from '../../shared/consts/error.const';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '../ports/user-repository.interface';
import { GetUsersQuery } from '../queries/get-users.query';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler
  implements IQueryHandler<GetUsersQuery, QueryResponse<GetUserResponseDto>>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}
  async execute(
    query: GetUsersQuery,
  ): Promise<QueryResponse<GetUserResponseDto>> {
    try {
      const users = await this.userRepository.getUsers([], query);
      const response: GetUserResponseDto = {
        users: users.map((user) => {
          return UserDtoMapper.toDto(user);
        }),
      };
      return QueryResponse.success(response);
    } catch (err) {
      return QueryResponse.failure();
    }
  }
}
