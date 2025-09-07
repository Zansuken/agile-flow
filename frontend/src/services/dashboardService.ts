import type { Project } from '../types/project';
import { TaskStatus } from '../types/task';
import { apiService } from './api';
import { taskService } from './taskService';

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

      // Calculate real task statistics across all projects
      let totalTasks = 0;
      let completedTasks = 0;
      let activeTasks = 0;

      try {
        // Fetch tasks for all projects in parallel
        const taskPromises = projects.map((project) =>
          taskService.getProjectTasks(project.id).catch((err) => {
            console.warn(
              `Failed to fetch tasks for project ${project.id}:`,
              err,
            );
            return []; // Return empty array if project tasks can't be fetched
          }),
        );

        const allProjectTasks = await Promise.all(taskPromises);

        // Flatten and count tasks
        const allTasks = allProjectTasks.flat();
        totalTasks = allTasks.length;
        completedTasks = allTasks.filter(
          (task) => task.status === TaskStatus.DONE,
        ).length;
        activeTasks = allTasks.filter(
          (task) =>
            task.status === TaskStatus.IN_PROGRESS ||
            task.status === TaskStatus.IN_REVIEW ||
            task.status === TaskStatus.TODO,
        ).length;
      } catch (error) {
        console.warn(
          'Error fetching task data for dashboard stats, using fallback:',
          error,
        );
        // Fallback to estimated values if task fetching fails
        totalTasks = totalProjects * 8; // Roughly 8 tasks per project
        activeTasks = Math.floor(totalTasks * 0.6);
        completedTasks = totalTasks - activeTasks;
      }

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

      // Calculate progress for each project asynchronously
      const recentProjectsPromises = sortedProjects.map(async (project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        // Calculate progress based on actual task completion
        progress: await this.calculateProjectProgress(project),
        team: project.memberIds?.length || 0,
        // Mock due date for now (you might want to add this field to your Project model)
        dueDate: this.mockDueDate(project),
        status: this.formatStatus(project.status),
        memberIds: project.memberIds || [],
        createdAt: this.convertToDate(project.createdAt),
        updatedAt: this.convertToDate(project.updatedAt),
      }));

      // Wait for all progress calculations to complete
      return await Promise.all(recentProjectsPromises);
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      return [];
    }
  }

  private async calculateProjectProgress(project: Project): Promise<number> {
    try {
      // Fetch all tasks for this project
      const tasks = await taskService.getProjectTasks(project.id);

      // If no tasks exist, return 0% progress
      if (tasks.length === 0) {
        return 0;
      }

      // Count completed tasks (status === 'done')
      const completedTasks = tasks.filter(
        (task) => task.status === TaskStatus.DONE,
      ).length;

      // Calculate progress percentage
      const progress = Math.round((completedTasks / tasks.length) * 100);

      return progress;
    } catch (error) {
      console.error(
        `Error calculating progress for project ${project.id}:`,
        error,
      );
      // Fallback to mock progress calculation if task fetching fails
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
