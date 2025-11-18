import { IsNotEmpty, IsString } from 'class-validator';

export class GetDpsQueryByIdDto {
  @IsString()
  @IsNotEmpty()
  dpsId: string;
}
