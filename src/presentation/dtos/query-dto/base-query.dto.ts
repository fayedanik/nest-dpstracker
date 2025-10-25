import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageIndex: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageLimit: number = 100;

  @IsOptional()
  @IsString()
  searchText: string = '';

  @IsOptional()
  filters?: unknown;
}
