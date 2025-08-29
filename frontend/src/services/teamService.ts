import type { User } from '../types';
import { ProjectRole } from '../utils/rbac';
import { apiService } from './api';

interface ProjectMember extends User {
  projectRole?: ProjectRole;
  joinedAt?: Date;
}

interface AddMemberRequest {
  projectId: string;
  memberId: string;
}

interface RemoveMemberRequest {
  projectId: string;
  memberId: string;
}

interface InviteResponse {
  message: string;
  userFound: boolean;
  invited: boolean;
  project?: unknown; // Project type would come from backend
}

class TeamService {
  // Get project members (we'll need to enhance the backend to return user details)
  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    try {
      const response = await apiService.get<ProjectMember[]>(
        `/projects/${projectId}/members`,
      );
      return response;
    } catch (error) {
      console.error('Error fetching project members:', error);
      // For now, return mock data until we implement the backend endpoint
      return [
        {
          id: 'dev-user-123',
          email: 'developer@agileflow.dev',
          displayName: 'Development User',
          role: 'project_manager',
          photoURL: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          projectRole: ProjectRole.OWNER,
        },
        {
          id: 'user-456',
          email: 'john.doe@example.com',
          displayName: 'John Doe',
          role: 'developer',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          createdAt: new Date(),
          updatedAt: new Date(),
          projectRole: ProjectRole.DEVELOPER,
        },
        {
          id: 'user-789',
          email: 'jane.smith@example.com',
          displayName: 'Jane Smith',
          role: 'developer',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
          createdAt: new Date(),
          updatedAt: new Date(),
          projectRole: ProjectRole.DESIGNER,
        },
      ] as ProjectMember[];
    }
  }

  // Search users by email or name
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await apiService.get<User[]>(
        `/users/search?q=${encodeURIComponent(query)}`,
      );
      return response;
    } catch (error) {
      console.error('Error searching users:', error);
      // For now, return mock data until we implement the backend endpoint
      const mockUsers: User[] = [
        {
          id: 'search-user-1',
          email: 'alice.johnson@example.com',
          displayName: 'Alice Johnson',
          role: 'developer',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'search-user-2',
          email: 'bob.wilson@example.com',
          displayName: 'Bob Wilson',
          role: 'tester',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'search-user-3',
          email: 'carol.davis@example.com',
          displayName: 'Carol Davis',
          role: 'project_manager',
          photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Filter mock users based on query
      return mockUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.displayName.toLowerCase().includes(query.toLowerCase()),
      );
    }
  }

  // Add member to project
  async addMember({ projectId, memberId }: AddMemberRequest): Promise<void> {
    try {
      await apiService.post(`/projects/${projectId}/members/${memberId}`);
    } catch (error) {
      console.error('Error adding member to project:', error);
      throw new Error('Failed to add member to project');
    }
  }

  // Remove member from project
  async removeMember({
    projectId,
    memberId,
  }: RemoveMemberRequest): Promise<void> {
    try {
      await apiService.delete(`/projects/${projectId}/members/${memberId}`);
    } catch (error) {
      console.error('Error removing member from project:', error);
      throw new Error('Failed to remove member from project');
    }
  }

  // Invite user by email with optional role
  async inviteUserByEmail(
    projectId: string,
    email: string,
    role: ProjectRole = ProjectRole.DEVELOPER,
  ): Promise<{ message: string; success: boolean }> {
    try {
      const response = await apiService.post<InviteResponse>(
        `/projects/${projectId}/invite`,
        { email, role },
      );

      return {
        message: response.message,
        success: response.invited,
      };
    } catch (error) {
      console.error('Error inviting user:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to invite user',
      );
    }
  }

  // Update member role in project
  async updateMemberRole(
    projectId: string,
    memberId: string,
    role: ProjectRole,
  ): Promise<void> {
    try {
      await apiService.patch(
        `/projects/${projectId}/members/${memberId}/role`,
        {
          role,
        },
      );
    } catch (error) {
      console.error('Error updating member role:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update member role',
      );
    }
  }

  // Get user's role in a specific project
  async getUserProjectRole(
    projectId: string,
    userId: string = 'me',
  ): Promise<ProjectRole | null> {
    try {
      const response = await apiService.get<{ role: ProjectRole | null }>(
        `/projects/${projectId}/members/${userId}/role`,
      );
      return response.role;
    } catch (error) {
      console.error('Error getting user project role:', error);
      return null;
    }
  }
}

export const teamService = new TeamService();
