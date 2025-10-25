import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { CommandBus } from '@nestjs/cqrs';
import { AddAccountCommandDto } from '../../dtos/comand-dtos/add-account-command.dto';
import { AddAccountCommand } from '../../../application/commands/bankAccount/add-account.command';
import { UpdateAccountCommandDto } from '../../dtos/comand-dtos/update-account-command.dto';
import { UpdateAccountCommand } from '../../../application/commands/bankAccount/update-account.command';
import { DeleteAccountCommand } from '../../../application/commands/bankAccount/delete-account.command';

@Controller('BankAccountCommand')
export class BankAccountCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('AddAccount')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public AddAccount(@Body() dto: AddAccountCommandDto) {
    const command = new AddAccountCommand(
      dto.accountNo,
      dto.bankName,
      dto.bankId,
      dto.branchName,
      dto.branchId,
      dto.accountType,
      dto.userIds,
    );
    return this.commandBus.execute(command);
  }

  @HttpCode(HttpStatus.OK)
  @Post('UpdateAccount')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public UpdateAccount(@Body() dto: UpdateAccountCommandDto) {
    const command = new UpdateAccountCommand(dto);
    console.log(dto);
    return this.commandBus.execute(command);
  }

  @HttpCode(HttpStatus.OK)
  @Post('DeleteAccount')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public DeleteAccount(@Body() dto: { id: string }) {
    const command = new DeleteAccountCommand(dto.id);
    return this.commandBus.execute(command);
  }
}
