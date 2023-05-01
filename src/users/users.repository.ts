import { DataSource, Repository } from 'typeorm';
import { User } from './users.entity';
import { AppDataSource } from 'src/typeorm.config';

const connection = AppDataSource;

export class UsersRepository extends Repository<User> {
  constructor() {
    super(User, connection.createEntityManager());
  }
}
