import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteDpsCommandDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
