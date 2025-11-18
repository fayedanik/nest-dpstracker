import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TransferMoneyCommandDto } from '../../dtos/comand-dtos/transfer-money-command.dto';
import { MakePaymentCommandDto } from '../../dtos/comand-dtos/make-payment-command.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/consts/role.const';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { TransferMoneyCommand } from '../../../application/commands/Transaction/transfer-money.command';
import { MakePaymentCommand } from '../../../application/commands/Transaction/make-payment.command';
import { UpdateStatusCommand } from '../../../application/commands/Transaction/update-status.command';
import { UpdateStatusCommandDto } from '../../dtos/comand-dtos/update-status-command.dto';

@Controller('TransactionCommand')
export class TransactionCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('TransferMoney')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin, Role.User])
  public TransferMoney(@Body() dto: TransferMoneyCommandDto) {
    const command = new TransferMoneyCommand(
      dto.sourceAc,
      dto.beneficiaryAc,
      dto.amount,
      dto.transactionDate,
      dto.transactionNumber,
      dto.note,
    );
    return this.commandBus.execute(command);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('MakePayment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin])
  public MakePayment(@Body() dto: MakePaymentCommandDto) {
    const command = new MakePaymentCommand(
      dto.sourceAc,
      dto.paymentType,
      dto.dpsId,
      dto.amount,
      dto.transactionNumber,
      dto.paymentDate,
      dto.note,
    );
    return this.commandBus.execute(command);
  }

  @HttpCode(HttpStatus.OK)
  @Post('UpdateStatus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([Role.Admin])
  public UpdateStatus(@Body() dto: UpdateStatusCommandDto) {
    const command = new UpdateStatusCommand(dto.transactionId);
    return this.commandBus.execute(command);
  }
}
