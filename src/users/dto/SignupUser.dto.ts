import { IsEmail, IsString, Length } from 'class-validator';

export class SignUpUserDTO {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsEmail()
  @Length(8, 150)
  email: string;

  @IsString()
  @Length(6, 100)
  password: string;
}
