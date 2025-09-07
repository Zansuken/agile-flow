import type { TaskPriority, TaskStatus } from '../../types/task';

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'default';
    case 'in_progress':
      return 'primary';
    case 'in_review':
      return 'warning';
    case 'done':
      return 'success';
    default:
      return 'default';
  }
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return 'default';
    case 'medium':
      return 'primary';
    case 'high':
      return 'warning';
    case 'urgent':
      return 'error';
    default:
      return 'default';
  }
};

export const formatDate = (date: Date | string | number) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
