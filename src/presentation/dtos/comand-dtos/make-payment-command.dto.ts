import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';

export class MakePaymentCommandDto {
  @IsNotEmpty()
  @IsString()
  sourceAc: string;

  @IsNotEmpty()
  @IsString()
  paymentType: string;

  @ValidateIf((o) => o.paymentType == 'dps')
  @IsOptional()
  @IsString()
  dpsId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  transactionNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  paymentDate: Date;

  @IsOptional()
  @IsString()
  note: string;
}
