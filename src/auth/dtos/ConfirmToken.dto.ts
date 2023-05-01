import { IsString } from 'class-validator';

export class ConfirmTokenDTO {
  @IsString()
  token: string;
}
