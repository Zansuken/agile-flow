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

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  avatar?: string;
}
