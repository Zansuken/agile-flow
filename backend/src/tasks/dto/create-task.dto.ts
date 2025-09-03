import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Implement user authentication',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Create login and registration functionality using Firebase Auth',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Project ID that this task belongs to',
    example: 'proj-123',
  })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'User ID assigned to this task',
    example: 'user-456',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: 'Estimated hours to complete the task',
    example: 8,
  })
  @IsOptional()
  estimatedHours?: number;

  @ApiPropertyOptional({
    description: 'Task due date',
    example: '2025-09-10T00:00:00.000Z',
  })
  @IsOptional()
  dueDate?: Date;

  @ApiPropertyOptional({
    description: 'Task tags for categorization',
    example: ['frontend', 'authentication', 'urgent'],
  })
  @IsOptional()
  tags?: string[];
}
