import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('roles')
  @ApiOperation({ summary: 'Get all project roles for the current user' })
  @ApiResponse({
    status: 200,
    description: 'User roles retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          projectId: { type: 'string' },
          projectName: { type: 'string' },
          role: {
            type: 'string',
            enum: ['owner', 'admin', 'developer', 'viewer'],
          },
          joinedAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserRoles(@CurrentUser() user: DecodedIdToken) {
    return await this.usersService.getUserRoles(user.uid);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search users by email or display name' })
  @ApiQuery({
    name: 'q',
    description: 'Search query (email or display name)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchUsers(
    @Query('q') query: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.usersService.searchUsers(query, user.uid);
  }

  @Post('by-ids')
  @ApiOperation({ summary: 'Get users by their IDs' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          displayName: { type: 'string' },
          photoURL: { type: 'string' },
          role: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUsersByIds(@Body() body: { ids: string[] }) {
    return await this.usersService.getUsersByIds(body.ids);
  }

  @Post('ensure-profile')
  @ApiOperation({ summary: 'Ensure user profile exists in Firestore' })
  @ApiResponse({
    status: 200,
    description: 'User profile created or verified successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async ensureUserProfile(
    @CurrentUser() user: DecodedIdToken,
    @Body() profileData?: { displayName?: string; photoURL?: string },
  ) {
    return await this.usersService.ensureUserProfile(user, profileData);
  }
}
