import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateUserCommandDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
