import { IsDate, IsDateString, IsString } from 'class-validator';

export class UpdateDateTodoDTO {
  @IsDateString()
  new_date: Date;
}
