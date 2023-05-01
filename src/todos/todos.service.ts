import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodoRepository } from './todos.repository';
import { Todo } from './todos.entity';
import { TodoPaginationDTO } from './dtos/TodoPagination.dto';
import { QuerySearchDTO } from './dtos/QuerySearch.dto';
import { QueryDateDTO } from './dtos/QueryDate.dto';
import { UpdateNameTodoDTO } from './dtos/UpdateNameTodo.dto';
import { UpdateDateTodoDTO } from './dtos/UpdateDateTodo.dto';
import { ITodoResponsePaginate } from './interfaces/ITodoResponsePaginate';
import { CreateTodoDTO } from './dtos/CreateTodo.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateStatusTodoDTO } from './dtos/UpdateStatusTodo.dto';

@Injectable()
export class TodosService {
  constructor(
    private todoRepository: TodoRepository,
    private userService: UsersService,
  ) {}

  public async createTodo(
    createTodoDTO: CreateTodoDTO,
    userId: string,
  ): Promise<boolean> {
    const { name, date } = createTodoDTO;
    const user = await this.userService.findUserById(userId);
    try {
      const todo = this.todoRepository.create({ name, date, user });
      await this.todoRepository.save(todo);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getTodosByPaginate(
    todoPaginationDTO: TodoPaginationDTO,
  ): Promise<ITodoResponsePaginate> {
    const { page, limit } = todoPaginationDTO;
    const result = await this.todoRepository.getTodosByPaginate(
      todoPaginationDTO,
    );
    const total = await this.todoRepository.count();
    const total_page =
      total % limit === 0 ? total / limit + 1 : Math.ceil(total / limit);
    if (!result)
      throw new BadRequestException(
        `Pagination is invalid with page: ${page}, limit: ${limit}`,
      );
    return {
      todos: result,
      total_page,
      page,
      limit,
    };
  }

  public async getTodosBySearchKey(
    querySearchDTO: QuerySearchDTO,
  ): Promise<Todo[]> {
    const result = await this.todoRepository.getTodosBySearch(querySearchDTO);
    return result;
  }

  public async getTodosBySearchDate(
    queryDateDTO: QueryDateDTO,
  ): Promise<Todo[]> {
    const result = await this.todoRepository.getTodosByDateSearch(queryDateDTO);
    return result;
  }

  public async getTodoById(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo not found by id: ${id}`);
    }
    return todo;
  }

  public async updateName(
    id: string,
    updateNameTodoDTO: UpdateNameTodoDTO,
  ): Promise<boolean> {
    const { new_name } = updateNameTodoDTO;
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo not found by id: ${id}`);
    }
    try {
      todo.name = new_name;
      await this.todoRepository.save(todo);
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async updateDate(
    id: string,
    updateDateTodoDTO: UpdateDateTodoDTO,
  ): Promise<boolean> {
    const { new_date } = updateDateTodoDTO;
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo not found by id: ${id}`);
    }
    try {
      todo.date = new_date;
      await this.todoRepository.save(todo);
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async updateStatus(
    id: string,
    updateStatusTodoDTO: UpdateStatusTodoDTO,
  ): Promise<boolean> {
    const { new_status } = updateStatusTodoDTO;
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo not found by id: ${id}`);
    }
    try {
      todo.status = new_status;
      await this.todoRepository.save(todo);
      return true;
    } catch (err) {
      throw err;
    }
  }

  public async deleteTodo(id: string): Promise<boolean> {
    try {
      const result = await this.todoRepository.delete(id);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
