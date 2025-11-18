import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionTypeEnum } from '../../../shared/consts/transactionType.enum';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class TransferMoneyCommandDto {
  @IsNotEmpty()
  @IsString()
  sourceAc: string;

  @IsOptional()
  @IsString()
  beneficiaryAc: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  transactionNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  transactionDate: Date;

  @IsOptional()
  @IsString()
  note: string;
}
