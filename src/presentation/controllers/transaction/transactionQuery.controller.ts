import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { GetTransactionsQuery } from '../../../application/queries/get-transactions.query';
import { GetTransactionsQueryDto } from '../../dtos/query-dtos/get-transactions-query.dto';

@Controller('TransactionQuery')
export class TransactionQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('GetTransactions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  getTransactions(@Query() dto: GetTransactionsQueryDto) {
    const query = new GetTransactionsQuery(
      dto.type,
      dto.pageIndex,
      dto.pageLimit,
    );
    return this.queryBus.execute(query);
  }
}
