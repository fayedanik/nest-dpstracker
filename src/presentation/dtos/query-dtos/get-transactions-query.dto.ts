import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from './base-query.dto';

export class GetTransactionsQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  type: string = '';
}
