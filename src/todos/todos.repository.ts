import { Between, Repository } from 'typeorm';
import { AppDataSource } from 'src/typeorm.config';
import { Todo } from './todos.entity';
import { TodoPaginationDTO } from './dtos/TodoPagination.dto';
import { QuerySearchDTO } from './dtos/QuerySearch.dto';
import { QueryDateDTO } from './dtos/QueryDate.dto';

const connection = AppDataSource;

export class TodoRepository extends Repository<Todo> {
  constructor() {
    super(Todo, connection.createEntityManager());
  }

  public async getAllTodos(): Promise<Todo[]> {
    return await this.find();
  }

  public async getTodosByPaginate(
    todoPaginationDTO: TodoPaginationDTO,
  ): Promise<Todo[]> {
    const { limit, page } = todoPaginationDTO;
    const result = await this.createQueryBuilder('todo')
      .skip(page * limit || 0)
      .take(limit || 10)
      .getMany();
    return result;
  }

  public async getTodosBySearch(
    querySearchDTO: QuerySearchDTO,
  ): Promise<Todo[]> {
    const { search_key } = querySearchDTO;
    const result = await this.createQueryBuilder('todo')
      .where('LOWER(todo.name) LIKE LOWER(:key)', {
        key: `%${search_key}%`,
      })
      .getMany();
    return result;
  }

  public async getTodosByDateSearch(
    queryDateDTO: QueryDateDTO,
  ): Promise<Todo[]> {
    const { date_key_start, date_key_end } = queryDateDTO;
    const result = await this.find({
      where: {
        date: Between(new Date(date_key_start), new Date(date_key_end)),
      },
    });
    return result;
  }
}
