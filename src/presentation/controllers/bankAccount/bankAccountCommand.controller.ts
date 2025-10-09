import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { CommandBus } from '@nestjs/cqrs';
import { AddAccountCommandDto } from '../../dtos/add-account-command.dto';
import { AddAccountCommand } from '../../../application/commands/add-account.command';

@Controller('BankAccountCommand')
export class BankAccountCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('AddAccount')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public AddAccount(@Body() dto: AddAccountCommandDto) {
    const command = new AddAccountCommand(
      dto.accountNo,
      dto.bankName,
      dto.bankId,
      dto.bankName,
      dto.branchId,
      dto.accountType,
      dto.userIds,
    );
    return this.commandBus.execute(command);
  }
}
