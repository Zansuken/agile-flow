export interface Notification {
  id: string;
  userId: string;
  type: 'task_comment' | 'task_assigned' | 'task_updated' | 'task_mention';
  title: string;
  message: string;
  taskId: string;
  projectId: string;
  commentId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  metadata?: {
    taskTitle?: string;
    projectName?: string;
    authorName?: string;
    [key: string]: unknown;
  };
}
