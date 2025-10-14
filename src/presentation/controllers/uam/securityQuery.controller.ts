import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAppsQuery } from 'src/application/queries/get-apps.query';
import { GetUserQuery } from 'src/application/queries/get-user.query';
import { GetUsersQuery } from '../../../application/queries/get-users.query';
import { Role } from '../../../shared/consts/role.const';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';

@Controller('SecurityQuery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SecurityQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @HttpCode(HttpStatus.OK)
  @Get('GetApps')
  @UseGuards(JwtAuthGuard)
  @Roles([Role.User, Role.Admin])
  GetApps() {
    return this.queryBus.execute(new GetAppsQuery());
  }

  @HttpCode(HttpStatus.OK)
  @Get('GetUser')
  @UseGuards(JwtAuthGuard)
  GetUser(@Query() query: any) {
    return this.queryBus.execute(new GetUserQuery(query.id));
  }

  @HttpCode(HttpStatus.OK)
  @Get('GetUsers')
  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  GetUsers() {
    return this.queryBus.execute(new GetUsersQuery());
  }
}
