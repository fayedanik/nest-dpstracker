import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDpsCommandDto {
  @IsNotEmpty()
  @IsString()
  dpsId: string;

  @IsNotEmpty()
  @IsNotEmpty()
  ownerId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  paymentDate: Date;
}
