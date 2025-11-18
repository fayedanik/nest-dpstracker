import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { GetDpsQuery } from '../../../application/queries/get-dps.query';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { GetDpsQueryByIdDto } from '../../dtos/query-dtos/get-dps-query-by-id.dto';
import { GetDpsByIdQuery } from '../../../application/queries/get-dps-by-id.query';

@Controller('DpsQuery')
export class DpsQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('GetDps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  GetDps(@Query() query: GetDpsQuery) {
    return this.queryBus.execute(new GetDpsQuery());
  }

  @HttpCode(HttpStatus.OK)
  @Get('GetDpsById')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  GetDpsById(@Query() query: GetDpsQueryByIdDto) {
    return this.queryBus.execute(new GetDpsByIdQuery(query.dpsId));
  }
}
