import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTaskDto, TaskPriority, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { Task, TaskFilters, TaskStats } from './interfaces/task.interface';

@Injectable()
export class TasksService {
  private readonly collection = 'tasks';

  constructor(private firebaseService: FirebaseService) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const firestore = this.firebaseService.getFirestore();

    // Verify user has access to the project
    await this.verifyProjectAccess(createTaskDto.projectId, userId);

    const taskData = {
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await firestore.collection(this.collection).add(taskData);

    const task = {
      id: docRef.id,
      ...taskData,
    } as Task;

    // Populate user data
    return this.populateUserData(task);
  }

  async findAll(
    projectId: string,
    userId: string,
    filters?: TaskFilters,
  ): Promise<Task[]> {
    const firestore = this.firebaseService.getFirestore();

    // Verify user has access to the project
    await this.verifyProjectAccess(projectId, userId);

    let query = firestore
      .collection(this.collection)
      .where('projectId', '==', projectId);

    // Apply filters
    if (filters?.status && filters.status.length > 0) {
      query = query.where('status', 'in', filters.status);
    }

    if (filters?.priority && filters.priority.length > 0) {
      query = query.where('priority', 'in', filters.priority);
    }

    if (filters?.assignedTo && filters.assignedTo.length > 0) {
      query = query.where('assignedTo', 'in', filters.assignedTo);
    }

    if (filters?.createdBy && filters.createdBy.length > 0) {
      query = query.where('createdBy', 'in', filters.createdBy);
    }

    // Order by creation date (newest first)
    // Commented out temporarily until Firestore composite index is created
    // query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: this.convertTimestamp(doc.data().createdAt),
      updatedAt: this.convertTimestamp(doc.data().updatedAt),
      dueDate: doc.data().dueDate
        ? this.convertTimestamp(doc.data().dueDate)
        : undefined,
      completedAt: doc.data().completedAt
        ? this.convertTimestamp(doc.data().completedAt)
        : undefined,
    })) as Task[];

    // Populate user data for all tasks
    const populatedTasks = await Promise.all(
      tasks.map((task) => this.populateUserData(task)),
    );

    // Apply date filters (Firestore doesn't support complex date range queries easily)
    let filteredTasks = populatedTasks;

    if (filters?.dueDateFrom || filters?.dueDateTo) {
      filteredTasks = populatedTasks.filter((task) => {
        if (!task.dueDate) return false;

        const dueDate = new Date(task.dueDate);
        if (filters.dueDateFrom && dueDate < filters.dueDateFrom) return false;
        if (filters.dueDateTo && dueDate > filters.dueDateTo) return false;

        return true;
      });
    }

    // Apply tag filters
    if (filters?.tags && filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter((task) => {
        if (!task.tags || task.tags.length === 0) return false;
        return filters.tags!.some((tag) => task.tags!.includes(tag));
      });
    }

    // Sort by creation date (newest first) - compensating for removed DB ordering
    filteredTasks.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // desc order
    });

    return filteredTasks;
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Task not found');
    }

    const taskData = doc.data();
    if (!taskData) {
      throw new NotFoundException('Task not found');
    }

    // Verify user has access to the project
    await this.verifyProjectAccess(taskData.projectId as string, userId);

    const task = {
      id: doc.id,
      ...taskData,
      createdAt: this.convertTimestamp(taskData.createdAt),
      updatedAt: this.convertTimestamp(taskData.updatedAt),
      dueDate: taskData.dueDate
        ? this.convertTimestamp(taskData.dueDate)
        : undefined,
      completedAt: taskData.completedAt
        ? this.convertTimestamp(taskData.completedAt)
        : undefined,
    } as Task;

    return this.populateUserData(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const firestore = this.firebaseService.getFirestore();

    // Get existing task
    const existingTask = await this.findOne(id, userId);

    // If changing project, verify access to new project
    if (
      updateTaskDto.projectId &&
      updateTaskDto.projectId !== existingTask.projectId
    ) {
      await this.verifyProjectAccess(updateTaskDto.projectId, userId);
    }

    const updateData: Record<string, any> = {
      ...updateTaskDto,
      updatedAt: new Date(),
    };

    // If status is being changed to DONE, set completedAt
    if (
      updateTaskDto.status === TaskStatus.DONE &&
      existingTask.status !== TaskStatus.DONE
    ) {
      updateData.completedAt = new Date();
    }

    // If status is being changed from DONE to something else, remove completedAt
    if (
      updateTaskDto.status &&
      updateTaskDto.status !== TaskStatus.DONE &&
      existingTask.status === TaskStatus.DONE
    ) {
      updateData.completedAt = null;
    }

    await firestore.collection(this.collection).doc(id).update(updateData);

    // Return updated task
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const firestore = this.firebaseService.getFirestore();

    // Verify task exists and user has access
    await this.findOne(id, userId);

    await firestore.collection(this.collection).doc(id).delete();
  }

  async getTaskStats(projectId: string, userId: string): Promise<TaskStats> {
    const tasks = await this.findAll(projectId, userId);

    const stats: TaskStats = {
      total: tasks.length,
      byStatus: {
        [TaskStatus.TODO]: 0,
        [TaskStatus.IN_PROGRESS]: 0,
        [TaskStatus.IN_REVIEW]: 0,
        [TaskStatus.DONE]: 0,
      },
      byPriority: {
        [TaskPriority.LOW]: 0,
        [TaskPriority.MEDIUM]: 0,
        [TaskPriority.HIGH]: 0,
        [TaskPriority.URGENT]: 0,
      },
      overdue: 0,
      completedThisWeek: 0,
    };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    let totalCompletionTime = 0;
    let completedTasksCount = 0;

    tasks.forEach((task) => {
      // Count by status
      stats.byStatus[task.status]++;

      // Count by priority
      stats.byPriority[task.priority]++;

      // Count overdue tasks
      if (
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== TaskStatus.DONE
      ) {
        stats.overdue++;
      }

      // Count completed this week
      if (
        task.completedAt &&
        new Date(task.completedAt) >= weekAgo &&
        task.status === TaskStatus.DONE
      ) {
        stats.completedThisWeek++;
      }

      // Calculate average completion time
      if (task.completedAt && task.createdAt) {
        const completionTime =
          new Date(task.completedAt).getTime() -
          new Date(task.createdAt).getTime();
        totalCompletionTime += completionTime;
        completedTasksCount++;
      }
    });

    // Calculate average completion time in hours
    if (completedTasksCount > 0) {
      stats.averageCompletionTime =
        totalCompletionTime / completedTasksCount / (1000 * 60 * 60);
    }

    return stats;
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

    const projectData = projectDoc.data() as Record<string, any>;
    const memberIds = projectData?.memberIds as string[] | undefined;
    if (!memberIds?.includes(userId)) {
      throw new ForbiddenException('Access denied to this project');
    }
  }

  private async populateUserData(task: Task): Promise<Task> {
    const firestore = this.firebaseService.getFirestore();

    // Populate assigned user data
    if (task.assignedTo) {
      try {
        const assignedUserDoc = await firestore
          .collection('users')
          .doc(task.assignedTo)
          .get();

        if (assignedUserDoc.exists) {
          const userData = assignedUserDoc.data() as Record<string, any>;
          task.assignedToUser = {
            id: task.assignedTo,
            email: (userData?.email as string) || '',
            displayName: (userData?.displayName as string) || 'Unknown User',
            photoURL: userData?.photoURL as string | undefined,
          };
        }
      } catch (error) {
        console.error('Error fetching assigned user data:', error);
      }
    }

    // Populate created by user data
    if (task.createdBy) {
      try {
        const createdByUserDoc = await firestore
          .collection('users')
          .doc(task.createdBy)
          .get();

        if (createdByUserDoc.exists) {
          const userData = createdByUserDoc.data() as Record<string, any>;
          task.createdByUser = {
            id: task.createdBy,
            email: (userData?.email as string) || '',
            displayName: (userData?.displayName as string) || 'Unknown User',
            photoURL: userData?.photoURL as string | undefined,
          };
        }
      } catch (error) {
        console.error('Error fetching created by user data:', error);
      }
    }

    return task;
  }

  private convertTimestamp(timestamp: any): Date {
    if (
      timestamp &&
      typeof timestamp === 'object' &&
      '_seconds' in timestamp &&
      '_nanoseconds' in timestamp
    ) {
      // Firestore Timestamp object
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const seconds = timestamp['_seconds'] as number;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const nanoseconds = timestamp['_nanoseconds'] as number;
      return new Date(seconds * 1000 + nanoseconds / 1000000);
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === 'string') {
      return new Date(timestamp);
    }
    return new Date();
  }
}
