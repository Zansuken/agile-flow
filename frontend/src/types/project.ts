// Type for Firebase Timestamp objects
interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export type ProjectStatus = 'active' | 'inactive' | 'archived';

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  ownerId: string;
  memberIds: string[];
  status: ProjectStatus;
  createdAt: string | Date | FirebaseTimestamp;
  updatedAt: string | Date | FirebaseTimestamp;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  key: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  key?: string;
}
