import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Permission, ProjectRole, hasPermission } from '../common/rbac';
import { FirebaseService } from '../firebase/firebase.service';
import {
  CreateProjectDto,
  ProjectStatus,
  UpdateProjectDto,
} from './dto/project.dto';

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  key: string;
  ownerId: string;
  memberIds: string[];
  members: ProjectMember[]; // New: detailed member info with roles
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface InviteResponse {
  message: string;
  userFound: boolean;
  invited: boolean;
  project?: Project;
}

@Injectable()
export class ProjectsService {
  private readonly collection = 'projects';

  constructor(private firebaseService: FirebaseService) {}

  // Helper method to check if user has permission for a specific action in a project
  private async checkPermission(
    projectId: string,
    userId: string,
    permission: Permission,
  ): Promise<{ project: Project; userRole: ProjectRole }> {
    const project = await this.findOne(projectId, userId);

    // Project owner always has all permissions
    if (project.ownerId === userId) {
      return { project, userRole: ProjectRole.OWNER };
    }

    // Find user's role in the project
    const memberInfo = project.members.find((m) => m.userId === userId);
    if (!memberInfo) {
      throw new ForbiddenException('User is not a member of this project');
    }

    // Check if user's role has the required permission
    if (!hasPermission(memberInfo.role, permission)) {
      throw new ForbiddenException(`Insufficient permissions for this action`);
    }

    return { project, userRole: memberInfo.role };
  }

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
      members: [
        {
          userId,
          role: ProjectRole.OWNER,
          joinedAt: new Date(),
        },
      ],
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
      ) => {
        const data = doc.data();
        // Ensure backward compatibility - if members array doesn't exist, create it from memberIds
        if (!data.members && Array.isArray(data.memberIds)) {
          data.members = (data.memberIds as string[]).map(
            (memberId: string) => ({
              userId: memberId,
              role:
                memberId === data.ownerId
                  ? ProjectRole.OWNER
                  : ProjectRole.DEVELOPER,
              joinedAt: (data.createdAt as Date) || new Date(),
            }),
          );
        }
        return {
          id: doc.id,
          ...data,
        };
      },
    ) as Project[];
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const firestore = this.firebaseService.getFirestore();
    const doc = await firestore.collection(this.collection).doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Project not found');
    }

    const data = doc.data();
    const project = { id: doc.id, ...data } as Project;

    // Ensure backward compatibility - if members array doesn't exist, create it from memberIds
    if (!project.members && Array.isArray(project.memberIds)) {
      project.members = project.memberIds.map((memberId: string) => ({
        userId: memberId,
        role:
          memberId === project.ownerId
            ? ProjectRole.OWNER
            : ProjectRole.DEVELOPER,
        joinedAt: project.createdAt || new Date(),
      }));
    }

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
    // Check if user has permission to edit project
    const { project } = await this.checkPermission(
      id,
      userId,
      Permission.EDIT_PROJECT,
    );

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
    // Check if user has permission to delete project
    await this.checkPermission(id, userId, Permission.DELETE_PROJECT);

    const firestore = this.firebaseService.getFirestore();
    await firestore.collection(this.collection).doc(id).delete();
  }

  async addMember(
    projectId: string,
    memberId: string,
    userId: string,
    role: ProjectRole = ProjectRole.DEVELOPER,
  ): Promise<Project> {
    // Check if user has permission to manage members
    const { project } = await this.checkPermission(
      projectId,
      userId,
      Permission.MANAGE_MEMBERS,
    );

    if (project.memberIds.includes(memberId)) {
      throw new BadRequestException('User is already a project member');
    }

    const firestore = this.firebaseService.getFirestore();
    const updatedMemberIds = [...project.memberIds, memberId];
    const newMember: ProjectMember = {
      userId: memberId,
      role,
      joinedAt: new Date(),
    };
    const updatedMembers = [...project.members, newMember];

    await firestore.collection(this.collection).doc(projectId).update({
      memberIds: updatedMemberIds,
      members: updatedMembers,
      updatedAt: new Date(),
    });

    return {
      ...project,
      memberIds: updatedMemberIds,
      members: updatedMembers,
      updatedAt: new Date(),
    };
  }

  async removeMember(
    projectId: string,
    memberId: string,
    userId: string,
  ): Promise<Project> {
    // Check if user has permission to manage members
    const { project } = await this.checkPermission(
      projectId,
      userId,
      Permission.MANAGE_MEMBERS,
    );

    if (memberId === project.ownerId) {
      throw new BadRequestException('Cannot remove project owner');
    }

    if (!project.memberIds.includes(memberId)) {
      throw new BadRequestException('User is not a project member');
    }

    const firestore = this.firebaseService.getFirestore();
    const updatedMemberIds = project.memberIds.filter((id) => id !== memberId);
    const updatedMembers = project.members.filter((m) => m.userId !== memberId);

    await firestore.collection(this.collection).doc(projectId).update({
      memberIds: updatedMemberIds,
      members: updatedMembers,
      updatedAt: new Date(),
    });

    return {
      ...project,
      memberIds: updatedMemberIds,
      members: updatedMembers,
      updatedAt: new Date(),
    };
  }

  async getMembers(projectId: string, userId: string): Promise<any[]> {
    const project = await this.findOne(projectId, userId);
    const firestore = this.firebaseService.getFirestore();

    // Get user documents for all member IDs
    const memberPromises = project.memberIds.map(async (memberId) => {
      try {
        const userDoc = await firestore.collection('users').doc(memberId).get();

        if (userDoc.exists) {
          const userData = userDoc.data() as Record<string, any>;

          // Helper function to convert Firestore Timestamp to Date
          const convertTimestamp = (timestamp: any): Date => {
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
            return new Date();
          };

          return {
            id: userDoc.id,
            email: (userData?.email as string) || 'unknown@example.com',
            displayName: (userData?.displayName as string) || 'Unknown User',
            photoURL: (userData?.photoURL as string) || null,
            role: (userData?.role as string) || 'developer',
            createdAt: convertTimestamp(userData?.createdAt),
            updatedAt: convertTimestamp(userData?.updatedAt),
            projectRole:
              memberId === project.ownerId ? 'Project Owner' : 'Member',
            joinedAt: convertTimestamp(userData?.createdAt),
          };
        } else {
          // Return a fallback for missing user documents
          return {
            id: memberId,
            email: `${memberId}@example.com`,
            displayName: 'Unknown User',
            photoURL: null,
            role: 'developer',
            createdAt: new Date(),
            updatedAt: new Date(),
            projectRole:
              memberId === project.ownerId ? 'Project Owner' : 'Member',
            joinedAt: new Date(),
          };
        }
      } catch (error) {
        console.error(`Error fetching user ${memberId}:`, error);
        // Return a fallback for errors
        return {
          id: memberId,
          email: `${memberId}@example.com`,
          displayName: 'Unknown User',
          photoURL: null,
          role: 'developer',
          createdAt: new Date(),
          updatedAt: new Date(),
          projectRole:
            memberId === project.ownerId ? 'Project Owner' : 'Member',
          joinedAt: new Date(),
        };
      }
    });

    const members = await Promise.all(memberPromises);
    return members;
  }

  async inviteUserByEmail(
    projectId: string,
    email: string,
    userId: string,
    role: ProjectRole = ProjectRole.DEVELOPER,
  ): Promise<InviteResponse> {
    const firestore = this.firebaseService.getFirestore();

    // Check if user has permission to manage members
    const { project } = await this.checkPermission(
      projectId,
      userId,
      Permission.MANAGE_MEMBERS,
    );

    try {
      // Find user by email
      const usersSnapshot = await firestore
        .collection('users')
        .where('email', '==', email.toLowerCase())
        .limit(1)
        .get();

      if (usersSnapshot.empty) {
        // User not found in the system
        return {
          message: `No user found with email ${email}. They need to create an account first.`,
          userFound: false,
          invited: false,
        };
      }

      const userDoc = usersSnapshot.docs[0];
      const inviteUserId = userDoc.id;

      // Check if user is already a member
      if (project.memberIds.includes(inviteUserId)) {
        return {
          message: `User ${email} is already a member of this project.`,
          userFound: true,
          invited: false,
        };
      }

      // Add user to project members
      const updatedMemberIds = [...project.memberIds, inviteUserId];
      const newMember: ProjectMember = {
        userId: inviteUserId,
        role,
        joinedAt: new Date(),
      };
      const updatedMembers = [...project.members, newMember];

      await firestore.collection(this.collection).doc(projectId).update({
        memberIds: updatedMemberIds,
        members: updatedMembers,
        updatedAt: new Date(),
      });

      // In a real application, you might also:
      // 1. Send an email notification to the invited user
      // 2. Create an invitation record with pending status
      // 3. Log the invitation activity

      const updatedProject: Project = {
        ...project,
        memberIds: updatedMemberIds,
        members: updatedMembers,
        updatedAt: new Date(),
      };

      return {
        message: `Successfully invited ${email} to the project as ${role}.`,
        userFound: true,
        invited: true,
        project: updatedProject,
      };
    } catch (error) {
      console.error('Error inviting user by email:', error);
      throw new BadRequestException('Failed to invite user');
    }
  }

  async updateMemberRole(
    projectId: string,
    memberId: string,
    newRole: ProjectRole,
    userId: string,
  ): Promise<Project> {
    // Check if user has permission to manage roles
    const { project } = await this.checkPermission(
      projectId,
      userId,
      Permission.MANAGE_ROLES,
    );

    if (!project.memberIds.includes(memberId)) {
      throw new BadRequestException('User is not a project member');
    }

    if (memberId === project.ownerId && newRole !== ProjectRole.OWNER) {
      throw new BadRequestException('Cannot change project owner role');
    }

    const firestore = this.firebaseService.getFirestore();
    const updatedMembers = project.members.map((member) =>
      member.userId === memberId ? { ...member, role: newRole } : member,
    );

    await firestore.collection(this.collection).doc(projectId).update({
      members: updatedMembers,
      updatedAt: new Date(),
    });

    return {
      ...project,
      members: updatedMembers,
      updatedAt: new Date(),
    };
  }

  async getUserProjectRole(
    projectId: string,
    userId: string,
  ): Promise<ProjectRole | null> {
    try {
      const project = await this.findOne(projectId, userId);

      // Check if user is project owner
      if (project.ownerId === userId) {
        return ProjectRole.OWNER;
      }

      // Check if user is in members array with a role
      const member = project.members?.find((m) => m.userId === userId);
      if (member?.role) {
        return member.role;
      }

      // Fallback: if user is in memberIds but not in members array (backward compatibility)
      if (project.memberIds?.includes(userId)) {
        return ProjectRole.DEVELOPER;
      }

      return null;
    } catch (error) {
      console.error('Error in getUserProjectRole:', error);
      return null;
    }
  }
}
