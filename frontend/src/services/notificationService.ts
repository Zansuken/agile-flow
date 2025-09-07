import type { Notification } from '../types/notification';
import { apiService } from './api';

class NotificationService {
  // Get user notifications
  async getUserNotifications(): Promise<Notification[]> {
    const response = await apiService.get<Notification[]>('/notifications');
    return response.map((notification) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
      readAt: notification.readAt ? new Date(notification.readAt) : undefined,
    }));
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    const response = await apiService.get<{ count: number }>(
      '/notifications/unread-count',
    );
    return response.count;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await apiService.put(`/notifications/${notificationId}/read`, {});
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await apiService.put('/notifications/mark-all-read', {});
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await apiService.delete(`/notifications/${notificationId}`);
  }

  // Delete all notifications
  async deleteAllNotifications(): Promise<void> {
    await apiService.delete('/notifications');
  }

  // Cleanup old notifications
  async cleanupOldNotifications(): Promise<void> {
    await apiService.delete('/notifications/cleanup');
  }
}

export const notificationService = new NotificationService();
