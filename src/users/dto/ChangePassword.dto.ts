import { IsString, Length } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @Length(6, 100)
  oldPassword: string;

  @IsString()
  @Length(6, 100)
  newPassword: string;
}
