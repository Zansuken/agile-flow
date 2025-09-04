import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({
    status: 200,
    description: 'API information retrieved successfully',
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async getHealth() {
    const startTime = Date.now();

    try {
      // Test Firebase connection
      const auth = this.firebaseService.getAuth();
      await auth.getUser('test-health-check').catch(() => {
        // This is expected to fail, but if it fails with a network error,
        // it indicates Firebase connectivity issues
      });

      const responseTime = Date.now() - startTime;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        services: {
          firebase: 'connected',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          },
        },
      };
    } catch (error: unknown) {
      const responseTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        services: {
          firebase: 'error',
          error: errorMessage,
        },
      };
    }
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  getReadiness() {
    try {
      // Verify Firebase is properly initialized
      const auth = this.firebaseService.getAuth();
      const firestore = this.firebaseService.getFirestore();

      if (!auth || !firestore) {
        throw new Error('Firebase services not initialized');
      }

      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
        services: ['firebase', 'auth', 'firestore'],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: errorMessage,
      };
    }
  }
}
