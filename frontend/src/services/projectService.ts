import type {
  CreateProjectDto,
  Project,
  UpdateProjectDto,
} from '../types/project';
import { apiService } from './api';

class ProjectService {
  async getProjects(): Promise<Project[]> {
    return apiService.get<Project[]>('/projects');
  }

  async getProject(id: string): Promise<Project> {
    return apiService.get<Project>(`/projects/${id}`);
  }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    return apiService.post<Project>('/projects', projectData);
  }

  async updateProject(
    id: string,
    projectData: UpdateProjectDto,
  ): Promise<Project> {
    return apiService.patch<Project>(`/projects/${id}`, projectData);
  }

  async deleteProject(id: string): Promise<void> {
    return apiService.delete<void>(`/projects/${id}`);
  }
}

export const projectService = new ProjectService();
