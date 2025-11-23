import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { PaymentTypeEnum } from '../../../shared/consts/paymentType.enum';

export class MakePaymentCommandDto {
  @IsNotEmpty()
  @IsString()
  sourceAc: string;

  @IsNotEmpty()
  @IsEnum(PaymentTypeEnum)
  paymentType: PaymentTypeEnum;

  @ValidateIf((o) => o.paymentType == PaymentTypeEnum.Dps)
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
