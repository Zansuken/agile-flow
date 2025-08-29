import type { Project } from '../types/project';
import { apiService } from './api';

// Type for Firebase Timestamp objects
interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number; // We'll calculate this from projects
  activeTasks: number;
  completedTasks: number;
  totalMembers: number;
  onlineMembers: number; // We'll mock this for now
}

export interface RecentProject {
  id: string;
  name: string;
  description: string;
  progress: number; // We'll calculate this based on status or mock it
  team: number; // memberIds.length
  dueDate: string; // We'll need to add this field or mock it
  status: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get all projects for the user
      const projects = await apiService.get<Project[]>('/projects');

      const totalProjects = projects.length;
      const activeProjects = projects.filter(
        (p) => p.status === 'active',
      ).length;
      const completedProjects = projects.filter(
        (p) => p.status === 'archived',
      ).length;

      // Calculate unique members across all projects
      const allMemberIds = new Set<string>();
      projects.forEach((project) => {
        project.memberIds?.forEach((memberId) => allMemberIds.add(memberId));
      });
      const totalMembers = allMemberIds.size;

      // For now, we'll mock task-related stats since we don't have a tasks API yet
      // In a real implementation, you'd fetch tasks data
      const totalTasks = totalProjects * 8; // Roughly 8 tasks per project
      const activeTasks = Math.floor(totalTasks * 0.6);
      const completedTasks = totalTasks - activeTasks;
      const onlineMembers = Math.floor(totalMembers * 0.3); // Mock 30% online

      return {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        activeTasks,
        completedTasks,
        totalMembers,
        onlineMembers,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return fallback data
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalTasks: 0,
        activeTasks: 0,
        completedTasks: 0,
        totalMembers: 0,
        onlineMembers: 0,
      };
    }
  }

  async getRecentProjects(limit: number = 6): Promise<RecentProject[]> {
    try {
      const projects = await apiService.get<Project[]>('/projects');

      // Sort by updatedAt (most recent first) and take the limit
      const sortedProjects = projects
        .sort(
          (a, b) =>
            this.getDateValue(b.updatedAt) - this.getDateValue(a.updatedAt),
        )
        .slice(0, limit);

      return sortedProjects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        // Calculate progress based on status or use a mock value
        progress: this.calculateProjectProgress(project),
        team: project.memberIds?.length || 0,
        // Mock due date for now (you might want to add this field to your Project model)
        dueDate: this.mockDueDate(project),
        status: this.formatStatus(project.status),
        memberIds: project.memberIds || [],
        createdAt: this.convertToDate(project.createdAt),
        updatedAt: this.convertToDate(project.updatedAt),
      }));
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      return [];
    }
  }

  private calculateProjectProgress(project: Project): number {
    // Mock progress calculation based on project status
    switch (project.status) {
      case 'active':
        return Math.floor(Math.random() * 40) + 30; // 30-70% for active projects
      case 'archived':
        return 100;
      case 'inactive':
        return Math.floor(Math.random() * 30) + 10; // 10-40% for inactive
      default:
        return Math.floor(Math.random() * 50) + 25; // 25-75% default
    }
  }

  private mockDueDate(project: Project): string {
    // Generate a mock due date between now and 3 months from creation
    const createdAt = this.convertToDate(project.createdAt);
    const threeMonthsLater = new Date(createdAt);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const randomDays = Math.floor(Math.random() * 90); // 0-90 days from creation
    const dueDate = new Date(createdAt);
    dueDate.setDate(dueDate.getDate() + randomDays);

    return dueDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  }

  private convertToDate(timestamp: string | Date | FirebaseTimestamp): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }

    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }

    // Handle Firestore Timestamp
    if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
      return new Date(
        timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000,
      );
    }

    return new Date();
  }

  private getDateValue(timestamp: string | Date | FirebaseTimestamp): number {
    return this.convertToDate(timestamp).getTime();
  }

  private formatStatus(status: string): string {
    switch (status) {
      case 'active':
        return 'In Progress';
      case 'archived':
        return 'Completed';
      case 'inactive':
        return 'On Hold';
      default:
        return 'Unknown';
    }
  }
}

export const dashboardService = new DashboardService();
