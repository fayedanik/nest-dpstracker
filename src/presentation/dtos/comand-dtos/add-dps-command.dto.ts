import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddDpsCommandDto {
  @IsNotEmpty()
  @IsString()
  dpsName: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsNumber()
  monthlyDeposit: number;

  @IsNotEmpty()
  @IsNumber()
  durationMonths: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  maturityDate: Date;

  @IsNotEmpty()
  @IsNumber()
  interestRate: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  dpsOwners: string[];
}
