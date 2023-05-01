import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from './mailer/mailer.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { AppDataSource } from 'src/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MailerModule,
    JwtModule,
    AuthModule,
    UsersModule,
    TodosModule,
    TypeOrmModule.forRoot({ ...AppDataSource.options }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
