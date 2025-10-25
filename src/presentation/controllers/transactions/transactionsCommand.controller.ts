import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddTransactionCommand } from '../../../application/commands/add-transaction.command';
import { AddTransactionCommandDto } from '../../dtos/comand-dtos/add-trasaction-command.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';

@Controller()
export class TrasactionCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('AddTransaction')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  AddTrasaction(@Body() dto: AddTransactionCommandDto) {
    const command = new AddTransactionCommand();
    return this.commandBus.execute(command);
  }
}
