import type {
  CreateTaskDto,
  Task,
  TaskFilters,
  TaskStats,
  UpdateTaskDto,
} from '../types/task';
import { apiService } from './api';

class TaskService {
  // Create a new task
  async createTask(taskData: CreateTaskDto): Promise<Task> {
    const response = await apiService.post<Task>('/tasks', taskData);
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      dueDate: response.dueDate ? new Date(response.dueDate) : undefined,
      completedAt: response.completedAt
        ? new Date(response.completedAt)
        : undefined,
    };
  }

  // Get all tasks for a project
  async getProjectTasks(
    projectId: string,
    filters?: TaskFilters,
  ): Promise<Task[]> {
    const params: Record<string, string | string[]> = {};

    // Convert filters to query parameters
    if (filters?.status) {
      params.status = filters.status;
    }
    if (filters?.priority) {
      params.priority = filters.priority;
    }
    if (filters?.assignedTo) {
      params.assignedTo = filters.assignedTo;
    }
    if (filters?.createdBy) {
      params.createdBy = filters.createdBy;
    }
    if (filters?.tags) {
      params.tags = filters.tags;
    }
    if (filters?.dueDateFrom) {
      params.dueDateFrom = filters.dueDateFrom.toISOString();
    }
    if (filters?.dueDateTo) {
      params.dueDateTo = filters.dueDateTo.toISOString();
    }

    const response = await apiService.get<Task[]>(
      `/tasks/project/${projectId}`,
      params,
    );

    return response.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  }

  // Get task by ID
  async getTask(taskId: string): Promise<Task> {
    const response = await apiService.get<Task>(`/tasks/${taskId}`);
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      dueDate: response.dueDate ? new Date(response.dueDate) : undefined,
      completedAt: response.completedAt
        ? new Date(response.completedAt)
        : undefined,
    };
  }

  // Update a task
  async updateTask(taskId: string, updateData: UpdateTaskDto): Promise<Task> {
    const response = await apiService.patch<Task>(
      `/tasks/${taskId}`,
      updateData,
    );
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      dueDate: response.dueDate ? new Date(response.dueDate) : undefined,
      completedAt: response.completedAt
        ? new Date(response.completedAt)
        : undefined,
    };
  }

  // Delete a task
  async deleteTask(taskId: string): Promise<void> {
    await apiService.delete(`/tasks/${taskId}`);
  }

  // Get task statistics for a project
  async getProjectTaskStats(projectId: string): Promise<TaskStats> {
    return await apiService.get<TaskStats>(`/tasks/project/${projectId}/stats`);
  }

  // Get available project members for task assignment
  async getProjectMembers(projectId: string): Promise<
    Array<{
      id: string;
      email: string;
      displayName: string;
      photoURL?: string;
      projectRole?: string;
    }>
  > {
    // This will use the existing team service endpoint
    return await apiService.get<
      Array<{
        id: string;
        email: string;
        displayName: string;
        photoURL?: string;
        projectRole?: string;
      }>
    >(`/projects/${projectId}/members`);
  }
}

export const taskService = new TaskService();
