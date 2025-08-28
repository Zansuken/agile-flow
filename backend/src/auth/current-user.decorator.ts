import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): DecodedIdToken | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
