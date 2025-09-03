import type { TaskUser } from '../types/task';
import { apiService } from './api';

export const userService = {
  searchUsers: async (query: string): Promise<TaskUser[]> => {
    return await apiService.get<TaskUser[]>(
      `/users/search?q=${encodeURIComponent(query)}`,
    );
  },

  ensureProfile: async (profileData?: {
    displayName?: string;
    photoURL?: string;
  }) => {
    return await apiService.post('/users/ensure-profile', profileData);
  },
};
