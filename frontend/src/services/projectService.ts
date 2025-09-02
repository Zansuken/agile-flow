import type { Project, ProjectStatus, User } from '../types';
import type { PaginatedResponse, QueryParams } from '../types/api';
import type { CreateProjectDto, UpdateProjectDto } from '../types/project';
import { BaseApiService } from './BaseApiService';

/**
 * Project Service
 * Handles all project-related API operations
 */
export class ProjectService extends BaseApiService {
  private readonly endpoint = '/api/projects';

  /**
   * Get all projects for the current user
   */
  async getProjects(params?: QueryParams): Promise<Project[]> {
    return this.get<Project[]>(this.endpoint, params);
  }

  /**
   * Get paginated projects
   */
  async getProjectsPaginated(
    params?: QueryParams,
  ): Promise<PaginatedResponse<Project>> {
    return this.getPaginated<Project>(`${this.endpoint}/paginated`, params);
  }

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<Project> {
    return this.get<Project>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new project
   */
  async createProject(projectData: CreateProjectDto): Promise<Project> {
    return this.post<Project>(this.endpoint, projectData);
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, updates: UpdateProjectDto): Promise<Project> {
    return this.patch<Project>(`${this.endpoint}/${id}`, updates);
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Update project status
   */
  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
  ): Promise<Project> {
    return this.patch<Project>(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Get project members
   */
  async getProjectMembers(projectId: string): Promise<User[]> {
    return this.get<User[]>(`${this.endpoint}/${projectId}/members`);
  }

  /**
   * Add member to project
   */
  async addProjectMember(
    projectId: string,
    userId: string,
    role?: string,
  ): Promise<void> {
    return this.post<void>(`${this.endpoint}/${projectId}/members`, {
      userId,
      role,
    });
  }

  /**
   * Remove member from project
   */
  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    return this.delete<void>(`${this.endpoint}/${projectId}/members/${userId}`);
  }

  /**
   * Search projects
   */
  async searchProjects(
    query: string,
    filters?: Record<string, unknown>,
  ): Promise<Project[]> {
    return this.get<Project[]>(`${this.endpoint}/search`, {
      search: query,
      ...filters,
    });
  }

  /**
   * Get project statistics
   */
  async getProjectStats(projectId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    activeSprints: number;
    teamMembers: number;
    progress: number;
  }> {
    return this.get(`${this.endpoint}/${projectId}/stats`);
  }

  /**
   * Archive project
   */
  async archiveProject(id: string): Promise<Project> {
    return this.updateProjectStatus(id, 'archived');
  }

  /**
   * Restore archived project
   */
  async restoreProject(id: string): Promise<Project> {
    return this.updateProjectStatus(id, 'active');
  }

  /**
   * Duplicate project
   */
  async duplicateProject(id: string, newName: string): Promise<Project> {
    return this.post<Project>(`${this.endpoint}/${id}/duplicate`, {
      name: newName,
    });
  }
}

// Create singleton instance
export const projectService = new ProjectService();
export default projectService;
