export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface TaskUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  assignedToUser?: TaskUser;
  createdBy: string;
  createdByUser?: TaskUser;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  completedAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  estimatedHours?: number;
  dueDate?: Date;
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  estimatedHours?: number;
  dueDate?: Date;
  tags?: string[];
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

// Helper functions for display
export const getTaskStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return '#6b7280'; // gray
    case TaskStatus.IN_PROGRESS:
      return '#3b82f6'; // blue
    case TaskStatus.IN_REVIEW:
      return '#f59e0b'; // amber
    case TaskStatus.DONE:
      return '#10b981'; // green
    default:
      return '#6b7280';
  }
};

export const getTaskPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.LOW:
      return '#10b981'; // green
    case TaskPriority.MEDIUM:
      return '#f59e0b'; // amber
    case TaskPriority.HIGH:
      return '#f97316'; // orange
    case TaskPriority.URGENT:
      return '#ef4444'; // red
    default:
      return '#6b7280';
  }
};

export const getTaskStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.IN_REVIEW:
      return 'In Review';
    case TaskStatus.DONE:
      return 'Done';
    default:
      return 'Unknown';
  }
};

export const getTaskPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case TaskPriority.LOW:
      return 'Low';
    case TaskPriority.MEDIUM:
      return 'Medium';
    case TaskPriority.HIGH:
      return 'High';
    case TaskPriority.URGENT:
      return 'Urgent';
    default:
      return 'Unknown';
  }
};
