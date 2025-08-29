export enum Permission {
  // Project permissions
  VIEW_PROJECT = 'view_project',
  EDIT_PROJECT = 'edit_project',
  DELETE_PROJECT = 'delete_project',

  // Member management permissions
  MANAGE_MEMBERS = 'manage_members',
  MANAGE_ROLES = 'manage_roles',

  // Task permissions
  CREATE_TASKS = 'create_tasks',
  EDIT_TASKS = 'edit_tasks',
  DELETE_TASKS = 'delete_tasks',

  // Sprint permissions
  CREATE_SPRINTS = 'create_sprints',
  EDIT_SPRINTS = 'edit_sprints',
  DELETE_SPRINTS = 'delete_sprints',
}

export enum ProjectRole {
  OWNER = 'owner',
  TEAM_LEAD = 'team_lead',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  TESTER = 'tester',
  VIEWER = 'viewer',
}

export interface RoleDefinition {
  name: ProjectRole;
  displayName: string;
  permissions: Permission[];
  description: string;
}

// Define role hierarchy and permissions
export const ROLE_DEFINITIONS: Record<ProjectRole, RoleDefinition> = {
  [ProjectRole.OWNER]: {
    name: ProjectRole.OWNER,
    displayName: 'Project Owner',
    permissions: Object.values(Permission), // Owner has ALL permissions
    description:
      'Full control over the project including member management and project settings',
  },

  [ProjectRole.TEAM_LEAD]: {
    name: ProjectRole.TEAM_LEAD,
    displayName: 'Team Lead',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.EDIT_PROJECT,
      Permission.MANAGE_MEMBERS,
      Permission.MANAGE_ROLES,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
      Permission.DELETE_TASKS,
      Permission.CREATE_SPRINTS,
      Permission.EDIT_SPRINTS,
      Permission.DELETE_SPRINTS,
    ],
    description:
      'Can manage team members, tasks, and sprints but cannot delete the project',
  },

  [ProjectRole.DEVELOPER]: {
    name: ProjectRole.DEVELOPER,
    displayName: 'Developer',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
      Permission.DELETE_TASKS,
    ],
    description: 'Can work with tasks and view project details',
  },

  [ProjectRole.DESIGNER]: {
    name: ProjectRole.DESIGNER,
    displayName: 'Designer',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
      Permission.DELETE_TASKS,
    ],
    description: 'Can work with design-related tasks and view project details',
  },

  [ProjectRole.TESTER]: {
    name: ProjectRole.TESTER,
    displayName: 'Tester',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
    ],
    description:
      'Can create and edit tasks, typically for bug reports and testing',
  },

  [ProjectRole.VIEWER]: {
    name: ProjectRole.VIEWER,
    displayName: 'Viewer',
    permissions: [Permission.VIEW_PROJECT],
    description: 'Read-only access to project information',
  },
};

export function hasPermission(
  role: ProjectRole,
  permission: Permission,
): boolean {
  const roleDefinition = ROLE_DEFINITIONS[role];
  return roleDefinition?.permissions.includes(permission) || false;
}

export function getRolePermissions(role: ProjectRole): Permission[] {
  return ROLE_DEFINITIONS[role]?.permissions || [];
}

export function getAllRoles(): RoleDefinition[] {
  return Object.values(ROLE_DEFINITIONS);
}

export function getRoleDisplayName(role: ProjectRole): string {
  return ROLE_DEFINITIONS[role]?.displayName || role;
}

export function getDefaultRole(): ProjectRole {
  return ProjectRole.DEVELOPER;
}
