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

export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  VIEWER = 'viewer',
}

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

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

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

export enum SprintStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

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

export enum TaskType {
  STORY = 'story',
  BUG = 'bug',
  TASK = 'task',
  EPIC = 'epic',
  SUBTASK = 'subtask',
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  TESTING = 'testing',
  DONE = 'done',
}

export enum TaskPriority {
  LOWEST = 'lowest',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HIGHEST = 'highest',
}

// Comment Types
export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request/Query Types
export interface CreateProjectRequest {
  name: string;
  description: string;
  key: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  assigneeId?: string;
  sprintId?: string;
  storyPoints?: number;
  tags?: string[];
  dueDate?: Date;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  sprintId?: string;
  storyPoints?: number;
  tags?: string[];
  dueDate?: Date;
}

export interface CreateSprintRequest {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  goal?: string;
}

export interface UpdateSprintRequest {
  name?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: SprintStatus;
  goal?: string;
}

// Filter and Query Types
export interface TaskFilters {
  status?: TaskStatus[];
  type?: TaskType[];
  priority?: TaskPriority[];
  assigneeId?: string;
  sprintId?: string;
  tags?: string[];
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  ownerId?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  activeSprints: number;
  overdueTasks: number;
}

export interface ProjectStats {
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  completionRate: number;
  activeSprints: number;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EntityId = string;

export interface BaseEntity {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

// Event Types for Real-time Updates
export enum EventType {
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_DELETED = 'task:deleted',
  PROJECT_CREATED = 'project:created',
  PROJECT_UPDATED = 'project:updated',
  SPRINT_CREATED = 'sprint:created',
  SPRINT_UPDATED = 'sprint:updated',
  USER_JOINED_PROJECT = 'user:joined_project',
  USER_LEFT_PROJECT = 'user:left_project',
}

export interface RealtimeEvent<T = any> {
  type: EventType;
  data: T;
  timestamp: Date;
  userId: string;
}
