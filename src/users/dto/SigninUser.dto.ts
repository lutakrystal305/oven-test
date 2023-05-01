import { IsString, Length, IsEmail } from 'class-validator';

export class SignInUserDTO {
  @IsString()
  @Length(8, 150)
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
