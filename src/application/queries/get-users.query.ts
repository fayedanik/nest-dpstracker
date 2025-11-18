import { BaseQuery } from './base.query';
import { GetUsersQueryDto } from '../../presentation/dtos/query-dtos/get-users-query.dto';

export class GetUsersQuery extends BaseQuery {
  constructor(dto: GetUsersQueryDto) {
    super();
    this.pageIndex = dto.pageIndex;
    this.pageLimit = dto.pageLimit;
    this.searchText = (dto.searchText ?? '').trim();
    this.filters = dto.filters;
  }
}
