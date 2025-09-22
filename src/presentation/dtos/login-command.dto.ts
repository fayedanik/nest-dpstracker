import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginCommandDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
