import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProjectRole } from '../common/rbac';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.create(createProjectDto, user.uid);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for current user' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: DecodedIdToken) {
    return this.projectsService.findAll(user.uid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: DecodedIdToken) {
    return this.projectsService.findOne(id, user.uid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.update(id, updateProjectDto, user.uid);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @CurrentUser() user: DecodedIdToken) {
    return this.projectsService.remove(id, user.uid);
  }

  @Post(':id/members/:memberId')
  @ApiOperation({ summary: 'Add member to project' })
  @ApiResponse({ status: 200, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.addMember(projectId, memberId, user.uid);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get project members' })
  @ApiResponse({
    status: 200,
    description: 'Project members retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMembers(
    @Param('id') projectId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.getMembers(projectId, user.uid);
  }

  @Delete(':id/members/:memberId')
  @ApiOperation({ summary: 'Remove member from project' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeMember(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.removeMember(projectId, memberId, user.uid);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite user to project by email' })
  @ApiResponse({ status: 200, description: 'Invitation sent successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description: 'User not found or already a member',
  })
  inviteUser(
    @Param('id') projectId: string,
    @Body() body: { email: string; role?: ProjectRole },
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.inviteUserByEmail(
      projectId,
      body.email,
      user.uid,
      body.role,
    );
  }

  @Patch(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role in project' })
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
  @ApiResponse({ status: 404, description: 'Project or member not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  updateMemberRole(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: ProjectRole },
    @CurrentUser() user: DecodedIdToken,
  ) {
    return this.projectsService.updateMemberRole(
      projectId,
      memberId,
      body.role,
      user.uid,
    );
  }

  @Get(':id/members/:memberId/role')
  @ApiOperation({ summary: 'Get user role in project' })
  @ApiResponse({ status: 200, description: 'User role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserRole(
    @Param('id') projectId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    // Users can check their own role or project members can check others
    const targetUserId = memberId === 'me' ? user.uid : memberId;
    const role = await this.projectsService.getUserProjectRole(
      projectId,
      targetUserId,
    );

    // Return a JSON object instead of a raw string
    return { role };
  }
}
