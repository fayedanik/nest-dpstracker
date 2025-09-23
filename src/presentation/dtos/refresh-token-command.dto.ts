import { IsNotEmpty } from 'class-validator';

export class RefreshTokenCommandDto {
  @IsNotEmpty()
  userId: string;
}
