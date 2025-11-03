import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAccountsQuery } from '../../../application/queries/get-accounts.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';

@Controller('BankAccountQuery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BankAccountQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('GetAccounts')
  @Roles([Role.Admin, Role.User])
  GetAccounts(@Query() query: GetAccountsQuery) {
    return this.queryBus.execute(new GetAccountsQuery());
  }
}
