import {
  Controller,
  Get,
  Patch,
  Delete,
  Query,
  BadRequestException,
  Param,
  Body,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todos.entity';
import { TodoPaginationDTO } from './dtos/TodoPagination.dto';
import { QuerySearchDTO } from './dtos/QuerySearch.dto';
import { QueryDateDTO } from './dtos/QueryDate.dto';
import { UpdateNameTodoDTO } from './dtos/UpdateNameTodo.dto';
import { UpdateDateTodoDTO } from './dtos/UpdateDateTodo.dto';
import { ITodoResponsePaginate } from './interfaces/ITodoResponsePaginate';
import { CreateTodoDTO } from './dtos/CreateTodo.dto';
import { GetUserId } from 'src/users/get-user.decorator';
import { HttpExceptionFilter } from 'src/exception/HttpExceptionFilter';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateStatusTodoDTO } from './dtos/UpdateStatusTodo.dto';

@UseFilters(new HttpExceptionFilter())
@UseGuards(AuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private todoService: TodosService) {}

  @Post()
  public async createTodo(
    @Body() createTodoDTO: CreateTodoDTO,
    @GetUserId() userId: string,
  ): Promise<any> {
    const result = await this.todoService.createTodo(createTodoDTO, userId);
    if (result) {
      return { message: 'You have just created todo successfully!' };
    }
  }

  @Get()
  public async getTodos(
    @Query() paginationDTO: TodoPaginationDTO,
  ): Promise<ITodoResponsePaginate> {
    const result = await this.todoService.getTodosByPaginate(paginationDTO);
    return result;
  }

  @Get('/search/name')
  public async searchTodoByKey(
    @Query() querySearchDTO: QuerySearchDTO,
  ): Promise<Todo[]> {
    const result = await this.todoService.getTodosBySearchKey(querySearchDTO);

    return result;
  }

  @Get('/search/date')
  public async searchTodoByDate(
    @Query() queryDateDTO: QueryDateDTO,
  ): Promise<Todo[]> {
    const result = await this.todoService.getTodosBySearchDate(queryDateDTO);
    return result;
  }

  @Get('/get/:id')
  public async getTodoById(@Param('id') id: string): Promise<Todo> {
    const result = await this.todoService.getTodoById(id);
    return result;
  }

  @Patch('/update/name/:id')
  public async updateNameTodo(
    @Param('id') id: string,
    @Body() updateNameDTO: UpdateNameTodoDTO,
  ): Promise<any> {
    const result = await this.todoService.updateName(id, updateNameDTO);
    if (result) {
      return { message: `Todo have just updated name within id: ${id}` };
    }
  }

  @Patch('update/date/:id')
  public async updateDateTodo(
    @Param('id') id: string,
    @Body() updateDateDTO: UpdateDateTodoDTO,
  ): Promise<any> {
    const result = await this.todoService.updateDate(id, updateDateDTO);
    if (result) {
      return { message: `Todo have just updated date within id: ${id}` };
    }
  }

  @Patch('update/status/:id')
  public async updateStatusTodo(
    @Param('id') id: string,
    @Body() updateStatusTodoDTO: UpdateStatusTodoDTO,
  ): Promise<any> {
    const result = await this.todoService.updateStatus(id, updateStatusTodoDTO);
    if (result) {
      return { message: `Todo have just updated status within id: ${id}` };
    }
  }

  @Delete('/delete/:id')
  public async deleteTodo(@Param('id') id: string): Promise<any> {
    const result = await this.todoService.deleteTodo(id);
    if (result) {
      return { message: `Todo have just deleted within id: ${id}` };
    }
  }
}
