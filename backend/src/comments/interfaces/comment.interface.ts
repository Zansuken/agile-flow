export interface Comment {
  id: string;
  taskId: string;
  projectId: string;
  authorId: string;
  content: string;
  parentId?: string; // For threading
  mentions?: string[]; // Mentioned user IDs
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  // Populated fields
  author?: {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
  };
  replies?: Comment[]; // For threading
}
