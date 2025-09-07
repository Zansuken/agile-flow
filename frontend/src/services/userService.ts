import type { TaskUser } from '../types/task';
import { apiService } from './api';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  searchUsers: async (query: string): Promise<TaskUser[]> => {
    return await apiService.get<TaskUser[]>(
      `/users/search?q=${encodeURIComponent(query)}`,
    );
  },

  getUsersByIds: async (userIds: string[]): Promise<UserProfile[]> => {
    return await apiService.post<UserProfile[]>('/users/by-ids', {
      ids: userIds,
    });
  },

  ensureProfile: async (profileData?: {
    displayName?: string;
    photoURL?: string;
  }) => {
    return await apiService.post('/users/ensure-profile', profileData);
  },
};
