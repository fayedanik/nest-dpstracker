import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import { CreateUserCommandDto } from '../../dtos/comand-dtos/create-user-command.dto';
import { ActivateUserCommandDto } from '../../dtos/comand-dtos/activate-user-command.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { ActivateUserCommand } from '../../../application/commands/activate-user.command';

@Controller('SecurityCommand')
export class SecurityCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('CreateUser')
  @HttpCode(HttpStatus.CREATED)
  CreateUser(@Body() dto: CreateUserCommandDto) {
    const command = new CreateUserCommand(
      dto.email,
      dto.firstName,
      dto.lastName,
      dto.password,
      dto.phoneNumber,
    );
    return this.commandBus.execute(command);
  }

  @Post('ActivateUser')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin])
  ActivatedUser(@Body() dto: ActivateUserCommandDto) {
    const command = new ActivateUserCommand(dto.userId);
    return this.commandBus.execute(command);
  }
  // @Post('ChangePassword')
  // ChangePassword(@Body() dto: ChangePasswordDto) {

  // }
}
