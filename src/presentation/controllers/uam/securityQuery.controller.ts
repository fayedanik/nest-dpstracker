import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAppsQuery } from 'src/application/queries/get-apps.query';
import { Role } from '../../../shared/consts/role.const';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';

@Controller('SecurityQuery')
export class SecurityQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('GetApps')
  @Roles([Role.User, Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  GetApps() {
    return this.queryBus.execute(new GetAppsQuery());
  }
}
