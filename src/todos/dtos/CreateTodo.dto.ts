import { IsDate, IsDateString, IsString } from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  name: string;

  @IsDateString()
  date: Date;
}
