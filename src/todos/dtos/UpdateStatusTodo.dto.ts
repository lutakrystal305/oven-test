import { IsDate, IsNumber, IsString } from 'class-validator';
import { StatusTodoEnum } from '../enums/StatusTodo.enum';
import { Type } from 'class-transformer';

export class UpdateStatusTodoDTO {
  @Type(() => Number)
  @IsNumber()
  new_status: StatusTodoEnum;
}
