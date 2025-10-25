import { BankAccountType } from '../../../shared/consts/bankAccountType.const';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
}
