import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/create-user.command';
import { CreateUserCommandDto } from '../../dtos/comand-dtos/create-user-command.dto';

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

  // @Post('ChangePassword')
  // ChangePassword(@Body() dto: ChangePasswordDto) {

  // }
}
