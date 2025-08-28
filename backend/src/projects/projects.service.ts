import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import {
  CreateProjectDto,
  ProjectStatus,
  UpdateProjectDto,
} from './dto/project.dto';

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  ownerId: string;
  memberIds: string[];
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProjectsService {
  private readonly collection = 'projects';

  constructor(private firebaseService: FirebaseService) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const firestore = this.firebaseService.getFirestore();

    // Check if project key already exists
    const existingProject = await firestore
      .collection(this.collection)
      .where('key', '==', createProjectDto.key.toUpperCase())
      .get();

    if (!existingProject.empty) {
      throw new BadRequestException('Project key already exists');
    }

    const projectData = {
      ...createProjectDto,
      key: createProjectDto.key.toUpperCase(),
      ownerId: userId,
      memberIds: [userId],
      status: ProjectStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await firestore.collection(this.collection).add(projectData);

    return {
      id: docRef.id,
      ...projectData,
    };
  }

  async findAll(userId: string): Promise<Project[]> {
    const firestore = this.firebaseService.getFirestore();

    // In development, allow dev-user-123 to see all projects
    const isDevUser =
      process.env.NODE_ENV === 'development' && userId === 'dev-user-123';

    let snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
    if (isDevUser) {
      // Get all projects for dev user
      snapshot = await firestore.collection(this.collection).get();
    } else {
      // Get only projects where user is a member
      snapshot = await firestore
        .collection(this.collection)
        .where('memberIds', 'array-contains', userId)
        .get();
    }

    return snapshot.docs.map(
      (
        doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
      ) => ({
        id: doc.id,
        ...doc.data(),
      }),
    ) as Project[];
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Project not found');
    }

    const project = { id: doc.id, ...doc.data() } as Project;

    // In development, allow dev-user-123 to access all projects
    const isDevUser =
      process.env.NODE_ENV === 'development' && userId === 'dev-user-123';

    if (!isDevUser && !project.memberIds.includes(userId)) {
      throw new ForbiddenException('Access denied to this project');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id, userId);

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can update project');
    }

    const firestore = this.firebaseService.getFirestore();
    const updateData = {
      ...updateProjectDto,
      updatedAt: new Date(),
    };

    await firestore.collection(this.collection).doc(id).update(updateData);

    return {
      ...project,
      ...updateData,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can delete project');
    }

    const firestore = this.firebaseService.getFirestore();
    await firestore.collection(this.collection).doc(id).delete();
  }

  async addMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(projectId, userId);

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can add members');
    }

    if (project.memberIds.includes(memberId)) {
      throw new BadRequestException('User is already a project member');
    }

    const firestore = this.firebaseService.getFirestore();
    const updatedMemberIds = [...project.memberIds, memberId];

    await firestore.collection(this.collection).doc(projectId).update({
      memberIds: updatedMemberIds,
      updatedAt: new Date(),
    });

    return {
      ...project,
      memberIds: updatedMemberIds,
      updatedAt: new Date(),
    };
  }

  async removeMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(projectId, userId);

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only project owner can remove members');
    }

    if (memberId === project.ownerId) {
      throw new BadRequestException('Cannot remove project owner');
    }

    if (!project.memberIds.includes(memberId)) {
      throw new BadRequestException('User is not a project member');
    }

    const firestore = this.firebaseService.getFirestore();
    const updatedMemberIds = project.memberIds.filter((id) => id !== memberId);

    await firestore.collection(this.collection).doc(projectId).update({
      memberIds: updatedMemberIds,
      updatedAt: new Date(),
    });

    return {
      ...project,
      memberIds: updatedMemberIds,
      updatedAt: new Date(),
    };
  }
}
