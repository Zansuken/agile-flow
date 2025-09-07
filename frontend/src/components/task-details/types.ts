import type { TaskPriority, TaskStatus } from '../../types/task';

export interface TaskEditData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  estimatedHours: string;
  dueDate: string;
}

// Re-export Comment from the centralized types
export type { Comment } from '../../types/comment';
