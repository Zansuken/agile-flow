import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return JSON.stringify(
      {
        name: 'AgileFlow API',
        version: '1.0.0',
        description: 'Backend API for AgileFlow project management application',
        documentation: '/api/docs',
        health: '/api/health',
      },
      null,
      2,
    );
  }
}
