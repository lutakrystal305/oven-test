import { IsEmail, IsString, Length } from 'class-validator';

export class ConfirmResetPasswordDTO {
  @IsString()
  @Length(6, 100)
  @IsEmail()
  email: string;
}
