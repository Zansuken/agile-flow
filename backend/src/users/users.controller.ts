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
