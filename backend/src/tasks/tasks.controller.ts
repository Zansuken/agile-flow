import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateTaskDto, TaskPriority, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { TaskFilters } from './interfaces/task.interface';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return await this.tasksService.create(createTaskDto, user.uid);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all tasks for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiQuery({
    name: 'status',
    required: false,
    isArray: true,
    enum: TaskStatus,
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    isArray: true,
    enum: TaskPriority,
  })
  @ApiQuery({ name: 'assignedTo', required: false, isArray: true })
  @ApiQuery({ name: 'createdBy', required: false, isArray: true })
  @ApiQuery({ name: 'tags', required: false, isArray: true })
  @ApiQuery({ name: 'dueDateFrom', required: false, type: Date })
  @ApiQuery({ name: 'dueDateTo', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findAllByProject(
    @Param('projectId') projectId: string,
    @CurrentUser() user: DecodedIdToken,
    @Query('status') status?: TaskStatus[],
    @Query('priority') priority?: TaskPriority[],
    @Query('assignedTo') assignedTo?: string[],
    @Query('createdBy') createdBy?: string[],
    @Query('tags') tags?: string[],
    @Query('dueDateFrom') dueDateFrom?: string,
    @Query('dueDateTo') dueDateTo?: string,
  ) {
    const filters: TaskFilters = {};

    if (status) {
      filters.status = Array.isArray(status) ? status : [status];
    }
    if (priority) {
      filters.priority = Array.isArray(priority) ? priority : [priority];
    }
    if (assignedTo) {
      filters.assignedTo = Array.isArray(assignedTo)
        ? assignedTo
        : [assignedTo];
    }
    if (createdBy) {
      filters.createdBy = Array.isArray(createdBy) ? createdBy : [createdBy];
    }
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }
    if (dueDateFrom) {
      filters.dueDateFrom = new Date(dueDateFrom);
    }
    if (dueDateTo) {
      filters.dueDateTo = new Date(dueDateTo);
    }

    return await this.tasksService.findAll(projectId, user.uid, filters);
  }

  @Get('project/:projectId/stats')
  @ApiOperation({ summary: 'Get task statistics for a project' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiResponse({
    status: 200,
    description: 'Task statistics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectStats(
    @Param('projectId') projectId: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return await this.tasksService.getTaskStats(projectId, user.uid);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: DecodedIdToken) {
    return await this.tasksService.findOne(id, user.uid);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    return await this.tasksService.update(id, updateTaskDto, user.uid);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: DecodedIdToken) {
    await this.tasksService.remove(id, user.uid);
    return { message: 'Task deleted successfully' };
  }
}
