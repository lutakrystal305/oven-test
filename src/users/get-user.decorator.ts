import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './users.entity';

export const GetUserId = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.id;
  },
);
