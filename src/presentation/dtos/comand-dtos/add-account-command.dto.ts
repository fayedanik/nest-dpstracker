import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BankAccountType } from '../../../shared/consts/bankAccountType.const';

export class AddAccountCommandDto {
  @IsNotEmpty()
  @IsString()
  accountNo: string;

  @IsNotEmpty()
  @IsString()
  bankName: string;

  @IsNotEmpty()
  @IsString()
  bankId: string;

  @IsNotEmpty()
  @IsString()
  branchName: string;

  @IsNotEmpty()
  @IsString()
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
