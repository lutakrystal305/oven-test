import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos.entity';
import { TodoRepository } from './todos.repository';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UsersModule, JwtModule],
  controllers: [TodosController],
  providers: [TodosService, TodoRepository],
})
export class TodosModule {}
