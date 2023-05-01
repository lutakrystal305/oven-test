import { IsString } from 'class-validator';

export class UpdateNameTodoDTO {
  @IsString()
  new_name: string;
}
