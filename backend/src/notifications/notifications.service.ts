import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import type { Notification } from './interfaces/notification.interface';

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds?: number;
}

@Injectable()
export class NotificationsService {
  private readonly collection = 'notifications';

  constructor(private firebaseService: FirebaseService) {}

  async createCommentNotification(
    taskId: string,
    projectId: string,
    commentId: string,
    authorId: string,
    assignedUserId: string,
    taskTitle: string,
    authorName: string,
    mentionedUserIds: string[] = [],
  ): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    // Collect all users to notify (assigned user + mentioned users)
    const usersToNotify = new Set<string>();

    // Add assigned user if exists and is not the author
    if (assignedUserId && assignedUserId !== authorId) {
      usersToNotify.add(assignedUserId);
    }

    // Add mentioned users (excluding author)
    mentionedUserIds.forEach((userId) => {
      if (userId !== authorId) {
        usersToNotify.add(userId);
      }
    });

    // Create notifications for all users
    const batch = firestore.batch();

    for (const userId of usersToNotify) {
      const notification: Omit<Notification, 'id'> = {
        userId,
        type: 'task_comment',
        title: 'New comment on task',
        message: `${authorName} commented on "${taskTitle}"`,
        taskId,
        projectId,
        commentId,
        isRead: false,
        createdAt: new Date(),
        metadata: {
          taskTitle,
          authorName,
        },
      };

      const docRef = firestore.collection(this.collection).doc();
      batch.set(docRef, notification);
    }

    if (usersToNotify.size > 0) {
      await batch.commit();
    }
  }

  async createMentionNotifications(
    taskId: string,
    projectId: string,
    commentId: string,
    authorId: string,
    mentionedUserIds: string[],
    taskTitle: string,
    authorName: string,
  ): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    // Filter out the author from mentions
    const usersToNotify = mentionedUserIds.filter(
      (userId) => userId !== authorId,
    );

    if (usersToNotify.length === 0) {
      return;
    }

    const batch = firestore.batch();

    for (const userId of usersToNotify) {
      const notification: Omit<Notification, 'id'> = {
        userId,
        type: 'task_mention',
        title: 'You were mentioned',
        message: `${authorName} mentioned you in a comment on "${taskTitle}"`,
        taskId,
        projectId,
        commentId,
        isRead: false,
        createdAt: new Date(),
        metadata: {
          taskTitle,
          authorName,
        },
      };

      const docRef = firestore.collection(this.collection).doc();
      batch.set(docRef, notification);
    }

    await batch.commit();
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    const firestore = this.firebaseService.getFirestore();

    const snapshot = await firestore
      .collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50) // Limit to last 50 notifications
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: this.convertTimestamp(data.createdAt),
        readAt: data.readAt ? this.convertTimestamp(data.readAt) : undefined,
      } as Notification;
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    const firestore = this.firebaseService.getFirestore();

    const snapshot = await firestore
      .collection(this.collection)
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .get();

    return snapshot.size;
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    const notificationDoc = await firestore
      .collection(this.collection)
      .doc(notificationId)
      .get();

    if (!notificationDoc.exists) {
      throw new Error('Notification not found');
    }

    const notificationData = notificationDoc.data();
    if (notificationData?.userId !== userId) {
      throw new Error('Not authorized to modify this notification');
    }

    await firestore.collection(this.collection).doc(notificationId).update({
      isRead: true,
      readAt: new Date(),
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    const snapshot = await firestore
      .collection(this.collection)
      .where('userId', '==', userId)
      .where('isRead', '==', false)
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = firestore.batch();
    const now = new Date();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        isRead: true,
        readAt: now,
      });
    });

    await batch.commit();
  }

  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    const notificationDoc = await firestore
      .collection(this.collection)
      .doc(notificationId)
      .get();

    if (!notificationDoc.exists) {
      throw new Error('Notification not found');
    }

    const notificationData = notificationDoc.data();
    if (notificationData?.userId !== userId) {
      throw new Error('Not authorized to delete this notification');
    }

    await firestore.collection(this.collection).doc(notificationId).delete();
  }

  async cleanupOldNotifications(): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    // Delete read notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshot = await firestore
      .collection(this.collection)
      .where('isRead', '==', true)
      .where('readAt', '<', thirtyDaysAgo)
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  private convertTimestamp(timestamp: unknown): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }

    if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
      const firestoreTimestamp = timestamp as FirestoreTimestamp;
      return new Date(
        firestoreTimestamp._seconds * 1000 +
          (firestoreTimestamp._nanoseconds || 0) / 1000000,
      );
    }

    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp);
    }

    return new Date();
  }
}
