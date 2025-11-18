import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusCommandDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;
}
