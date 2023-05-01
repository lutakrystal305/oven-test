import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../jwt/jwt.service';
import { UsersService } from '../users/users.service';
import { TypeTokenEnum } from '../jwt/enums/TypeToken.eums';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token invalid');
    }
    const token = authHeader.split(' ')[1];
    const payload: IJwtPayload = await this.jwtService.verifyTokenByType(
      TypeTokenEnum.ACCESS_TOKEN,
      token,
    );

    const { userId } = payload;
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Access token invalid');
    } else {
      req.user = user;
      return true;
    }
  }
}
