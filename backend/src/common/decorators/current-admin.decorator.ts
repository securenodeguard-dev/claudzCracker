import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Pulls the authenticated admin (attached by JwtStrategy.validate) off the request.
export const CurrentAdmin = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
