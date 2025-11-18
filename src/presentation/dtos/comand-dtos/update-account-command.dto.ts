import { BankAccountType } from '../../../shared/consts/bankAccountType.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateAccountCommandDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  accountNo: string;

  @IsOptional()
  bankName: string;
  @IsOptional()
  bankId: string;
  @IsOptional()
  branchName: string;
  @IsOptional()
  branchId: string;

  @IsNotEmpty()
  @IsEnum(BankAccountType)
  accountType: BankAccountType;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  userIds: string[];

  @IsOptional()
  @IsNumber()
  balance: number;
}
