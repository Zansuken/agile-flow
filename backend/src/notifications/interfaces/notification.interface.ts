export interface Notification {
  id: string;
  userId: string; // Who receives the notification
  type: 'task_comment' | 'task_assigned' | 'task_updated' | 'task_mention';
  title: string;
  message: string;
  taskId: string;
  projectId: string;
  commentId?: string; // For comment notifications
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  // Optional metadata
  metadata?: {
    taskTitle?: string;
    projectName?: string;
    authorName?: string;
    [key: string]: any;
  };
}
