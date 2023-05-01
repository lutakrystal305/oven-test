import { Todo } from '../todos.entity';

export class ITodoResponsePaginate {
  todos: Todo[];
  total_page: number;
  page: number;
  limit: number;
}
