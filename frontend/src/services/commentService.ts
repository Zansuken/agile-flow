import type {
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
} from '../types/comment';
import { apiService } from './api';

class CommentService {
  // Create a new comment
  async createComment(
    taskId: string,
    commentData: CreateCommentDto,
  ): Promise<Comment> {
    const response = await apiService.post<Comment>(
      `/tasks/${taskId}/comments`,
      commentData,
    );
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      editedAt: response.editedAt ? new Date(response.editedAt) : undefined,
    };
  }

  // Get all comments for a task
  async getTaskComments(taskId: string): Promise<Comment[]> {
    const response = await apiService.get<Comment[]>(
      `/tasks/${taskId}/comments`,
    );
    return response.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
      editedAt: comment.editedAt ? new Date(comment.editedAt) : undefined,
      replies: comment.replies?.map((reply) => ({
        ...reply,
        createdAt: new Date(reply.createdAt),
        updatedAt: new Date(reply.updatedAt),
        editedAt: reply.editedAt ? new Date(reply.editedAt) : undefined,
      })),
    }));
  }

  // Update a comment
  async updateComment(
    commentId: string,
    updateData: UpdateCommentDto,
  ): Promise<Comment> {
    const response = await apiService.patch<Comment>(
      `/comments/${commentId}`,
      updateData,
    );
    return {
      ...response,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
      editedAt: response.editedAt ? new Date(response.editedAt) : undefined,
    };
  }

  // Delete a comment
  async deleteComment(commentId: string): Promise<void> {
    await apiService.delete(`/comments/${commentId}`);
  }

  // Parse mentions from comment content
  parseMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  // Format content with mentions highlighted
  formatContentWithMentions(content: string): string {
    return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  }
}

export const commentService = new CommentService();
