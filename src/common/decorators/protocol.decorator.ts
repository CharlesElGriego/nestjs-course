// Using the Protocol decorator
import {
  /* optional defaultValue */ /* @Protocal() decorator FINAL CODE */
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Protocol = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
