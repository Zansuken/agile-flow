import { TaskPriority, TaskStatus } from '../dto/create-task.dto';

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  assignedToUser?: {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
  createdBy: string;
  createdByUser?: {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  createdBy?: string[];
  tags?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue: number;
  completedThisWeek: number;
  averageCompletionTime?: number;
}
