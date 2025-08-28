import {
  Injectable,
  CanActivate,
  ExecutionContext,
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
    } catch {
      // In development, if we can't verify the token, create a mock user
      if (
        process.env.NODE_ENV === 'development' &&
        token === process.env.DEV_BEARER_TOKEN
      ) {
        console.log('🔧 Using mock user for development');
        request.user = {
          uid: 'dev-user-123',
          email: 'developer@agileflow.dev',
          name: 'Development User',
          aud: '',
          auth_time: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600,
          firebase: {},
          iat: Math.floor(Date.now() / 1000),
          iss: '',
          sub: 'dev-user-123',
        };
        return true;
      }
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
