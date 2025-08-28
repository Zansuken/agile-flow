// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const UserRole = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  DEVELOPER: 'developer',
  TESTER: 'tester',
  VIEWER: 'viewer',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  key: string; // Unique project key (e.g., "AGILE")
  ownerId: string;
  memberIds: string[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

// Sprint Types
export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  goal?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const SprintStatus = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type SprintStatus = typeof SprintStatus[keyof typeof SprintStatus];

// Task Types
export interface Task {
  id: string;
  projectId: string;
  sprintId?: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  reporterId: string;
  storyPoints?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export const TaskType = {
  STORY: 'story',
  BUG: 'bug',
  TASK: 'task',
  EPIC: 'epic',
  SUBTASK: 'subtask',
} as const;

export type TaskType = typeof TaskType[keyof typeof TaskType];

export const TaskStatus = {
  BACKLOG: 'backlog',
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  TESTING: 'testing',
  DONE: 'done',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOWEST: 'lowest',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  HIGHEST: 'highest',
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];
