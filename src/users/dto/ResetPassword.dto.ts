import { IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  token: string;
}
