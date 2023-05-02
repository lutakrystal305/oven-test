import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from 'src/jwt/jwt.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [UsersModule, JwtModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
