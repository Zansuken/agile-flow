import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseService } from '../firebase/firebase.service';

interface AuthenticatedRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    let token = this.extractTokenFromHeader(request);

    // In development, allow using a default token from environment
    if (
      !token &&
      process.env.NODE_ENV === 'development' &&
      process.env.DEV_BEARER_TOKEN
    ) {
      token = process.env.DEV_BEARER_TOKEN;
      console.log('🔧 Using development bearer token from environment');
    }

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = await this.firebaseService.verifyIdToken(token);
      request.user = decodedToken;
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorCode: string =
        typeof error === 'object' && error !== null && 'code' in error
          ? String((error as { code: unknown }).code)
          : 'unknown';

      console.error('Token verification failed:', {
        error: errorMessage,
        code: errorCode,
      });
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
