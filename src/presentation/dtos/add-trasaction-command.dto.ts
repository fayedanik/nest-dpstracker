import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddTransactionCommandDto {
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  dpsNumber: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
