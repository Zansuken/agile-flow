import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import type { Comment } from './interfaces/comment.interface';

interface TaskData {
  projectId: string;
  title: string;
  assignedTo?: string;
  [key: string]: any;
}

interface ProjectData {
  memberIds: string[];
  [key: string]: any;
}

interface UserData {
  email: string;
  displayName: string;
  photoURL?: string;
  [key: string]: any;
}

interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds?: number;
}

@Injectable()
export class CommentsService {
  private readonly collection = 'comments';

  constructor(
    private firebaseService: FirebaseService,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    taskId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const firestore = this.firebaseService.getFirestore();

    // Get task to verify access and get project ID
    const taskDoc = await firestore.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      throw new NotFoundException('Task not found');
    }

    const taskData = taskDoc.data() as TaskData;
    if (!taskData?.projectId) {
      throw new NotFoundException('Task does not have a valid project ID');
    }

    // Verify user has access to the project
    await this.verifyProjectAccess(taskData.projectId, userId);

    // If it's a reply, verify parent comment exists
    if (createCommentDto.parentId) {
      const parentDoc = await firestore
        .collection(this.collection)
        .doc(createCommentDto.parentId)
        .get();

      if (!parentDoc.exists) {
        throw new BadRequestException('Parent comment not found');
      }

      const parentData = parentDoc.data();
      if (parentData?.taskId !== taskId) {
        throw new BadRequestException(
          'Parent comment does not belong to this task',
        );
      }
    }

    const commentData = {
      ...createCommentDto,
      taskId,
      projectId: taskData.projectId,
      authorId: userId,
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await firestore.collection(this.collection).add(commentData);

    const comment = {
      id: docRef.id,
      ...commentData,
    } as Comment;

    // Populate author data
    const populatedComment = await this.populateAuthorData(comment);

    // Trigger notifications for assigned users and mentioned users
    await this.triggerCommentNotifications(
      taskId,
      taskData.projectId,
      comment.id,
      userId,
      createCommentDto.mentions || [],
    );

    return populatedComment;
  }

  async findByTask(taskId: string, userId: string): Promise<Comment[]> {
    const firestore = this.firebaseService.getFirestore();

    // Get task to verify access
    const taskDoc = await firestore.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      throw new NotFoundException('Task not found');
    }

    const taskData = taskDoc.data() as TaskData;
    if (!taskData?.projectId) {
      throw new NotFoundException('Task does not have a valid project ID');
    }

    // Verify user has access to the project
    await this.verifyProjectAccess(taskData.projectId, userId);

    // Get all comments for this task
    const snapshot = await firestore
      .collection(this.collection)
      .where('taskId', '==', taskId)
      .orderBy('createdAt', 'asc')
      .get();

    const comments = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const commentData = doc.data();
        const comment = {
          id: doc.id,
          ...commentData,
          createdAt: this.convertTimestamp(commentData.createdAt),
          updatedAt: this.convertTimestamp(commentData.updatedAt),
          editedAt: commentData.editedAt
            ? this.convertTimestamp(commentData.editedAt)
            : undefined,
        } as Comment;

        return this.populateAuthorData(comment);
      }),
    );

    // Build threaded structure
    return this.buildThreadedComments(comments);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const firestore = this.firebaseService.getFirestore();

    // Get existing comment
    const commentDoc = await firestore
      .collection(this.collection)
      .doc(id)
      .get();
    if (!commentDoc.exists) {
      throw new NotFoundException('Comment not found');
    }

    const commentData = commentDoc.data();

    // Verify user is the author
    if (commentData?.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    const updateData = {
      ...updateCommentDto,
      isEdited: true,
      editedAt: new Date(),
      updatedAt: new Date(),
    };

    await firestore.collection(this.collection).doc(id).update(updateData);

    // Return updated comment
    const updatedDoc = await firestore
      .collection(this.collection)
      .doc(id)
      .get();
    const updatedData = updatedDoc.data();

    const comment = {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: this.convertTimestamp(updatedData?.createdAt),
      updatedAt: this.convertTimestamp(updatedData?.updatedAt),
      editedAt: this.convertTimestamp(updatedData?.editedAt),
    } as Comment;

    return this.populateAuthorData(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    // Get existing comment
    const commentDoc = await firestore
      .collection(this.collection)
      .doc(id)
      .get();
    if (!commentDoc.exists) {
      throw new NotFoundException('Comment not found');
    }

    const commentData = commentDoc.data();

    // Verify user is the author or has admin permissions
    if (commentData?.authorId !== userId) {
      // TODO: Add admin permission check
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Check if comment has replies
    const repliesSnapshot = await firestore
      .collection(this.collection)
      .where('parentId', '==', id)
      .get();

    if (!repliesSnapshot.empty) {
      throw new BadRequestException(
        'Cannot delete comment with replies. Delete replies first.',
      );
    }

    await firestore.collection(this.collection).doc(id).delete();
  }

  private async verifyProjectAccess(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const firestore = this.firebaseService.getFirestore();
    const projectDoc = await firestore
      .collection('projects')
      .doc(projectId)
      .get();

    if (!projectDoc.exists) {
      throw new NotFoundException('Project not found');
    }

    const projectData = projectDoc.data() as ProjectData;
    if (!projectData?.memberIds?.includes(userId)) {
      throw new ForbiddenException('Access denied to this project');
    }
  }

  private async populateAuthorData(comment: Comment): Promise<Comment> {
    const firestore = this.firebaseService.getFirestore();

    try {
      const authorDoc = await firestore
        .collection('users')
        .doc(comment.authorId)
        .get();

      if (authorDoc.exists) {
        const userData = authorDoc.data() as UserData;
        comment.author = {
          id: comment.authorId,
          email: userData?.email || '',
          displayName: userData?.displayName || 'Unknown User',
          photoURL: userData?.photoURL,
        };
      }
    } catch (error) {
      console.error('Error fetching author data:', error);
    }

    return comment;
  }

  private buildThreadedComments(comments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map and initialize replies arrays
    comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // Second pass: build thread structure
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
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

  private async triggerCommentNotifications(
    taskId: string,
    projectId: string,
    commentId: string,
    authorId: string,
    mentionedUserIds: string[],
  ): Promise<void> {
    try {
      const firestore = this.firebaseService.getFirestore();

      // Get task details
      const taskDoc = await firestore.collection('tasks').doc(taskId).get();
      const taskData = taskDoc.data() as TaskData;
      const taskTitle = taskData?.title || 'Unknown Task';

      // Get author details
      const authorDoc = await firestore.collection('users').doc(authorId).get();
      const authorData = authorDoc.data() as UserData;
      const authorName = authorData?.displayName || 'Unknown User';

      // Get assigned user ID
      const assignedUserId = taskData?.assignedTo as string;

      // Create comment notifications
      if (assignedUserId) {
        await this.notificationsService.createCommentNotification(
          taskId,
          projectId,
          commentId,
          authorId,
          assignedUserId,
          taskTitle,
          authorName,
          mentionedUserIds,
        );
      }

      // Create mention notifications if there are mentions
      if (mentionedUserIds.length > 0) {
        await this.notificationsService.createMentionNotifications(
          taskId,
          projectId,
          commentId,
          authorId,
          mentionedUserIds,
          taskTitle,
          authorName,
        );
      }
    } catch (error) {
      console.error('Error triggering comment notifications:', error);
      // Don't throw error to prevent comment creation from failing
    }
  }
}
