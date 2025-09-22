import { IsNotEmpty } from 'class-validator';

export class RefreshTokenCommandDto {
  @IsNotEmpty()
  refreshToken: string;
}
