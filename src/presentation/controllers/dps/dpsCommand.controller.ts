import { CommandBus } from '@nestjs/cqrs';
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
import { AddDpsCommandDto } from '../../dtos/comand-dtos/add-dps-command.dto';
import { AddDpsCommand } from '../../../application/commands/dps/add-dps.command';
import { DeleteDpsCommandDto } from '../../dtos/comand-dtos/delete-dps-command.dto';
import { DeleteDpsCommand } from '../../../application/commands/dps/delete-dps.command';

@Controller('DpsCommand')
export class DpsCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('CreateDps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public CreateDps(@Body() dto: AddDpsCommandDto) {
    const command = new AddDpsCommand(
      dto.accountNumber,
      dto.monthlyDeposit,
      dto.durationMonths,
      dto.startDate,
      dto.maturityDate,
      dto.interestRate,
      dto.dpsOwners,
    );
    return this.commandBus.execute(command);
  }

  @HttpCode(HttpStatus.OK)
  @Post('DeleteDps')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public DeleteDps(@Body() dto: DeleteDpsCommandDto) {
    const command = new DeleteDpsCommand(dto.Id);
    return this.commandBus.execute(command);
  }
}
