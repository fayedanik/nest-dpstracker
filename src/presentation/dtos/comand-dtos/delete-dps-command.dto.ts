import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDpsCommandDto {
  @IsNotEmpty()
  @IsString()
  Id: string;
}
