import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { GetStatsQuery } from '../../../application/queries/get-stats.query';

@Controller('DashboardQuery')
export class DashboardQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('GetStats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public getStats(@Query() query: any) {
    return this.queryBus.execute(new GetStatsQuery());
  }
}
