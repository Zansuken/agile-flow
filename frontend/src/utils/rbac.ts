// Role-Based Access Control utilities for frontend
export const Permission = {
  VIEW_PROJECT: 'view_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  MANAGE_MEMBERS: 'manage_members',
  MANAGE_ROLES: 'manage_roles',
  CREATE_TASKS: 'create_tasks',
  EDIT_TASKS: 'edit_tasks',
  DELETE_TASKS: 'delete_tasks',
  CREATE_SPRINTS: 'create_sprints',
  EDIT_SPRINTS: 'edit_sprints',
  DELETE_SPRINTS: 'delete_sprints',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const ProjectRole = {
  OWNER: 'owner',
  TEAM_LEAD: 'team_lead',
  DEVELOPER: 'developer',
  DESIGNER: 'designer',
  TESTER: 'tester',
  VIEWER: 'viewer',
} as const;

export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];

export interface RoleDefinition {
  name: string;
  description: string;
  permissions: Permission[];
  hierarchy: number;
}

export const ROLE_DEFINITIONS: Record<ProjectRole, RoleDefinition> = {
  [ProjectRole.OWNER]: {
    name: 'Owner',
    description:
      'Full control over the project including deletion and role management',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.EDIT_PROJECT,
      Permission.DELETE_PROJECT,
      Permission.MANAGE_MEMBERS,
      Permission.MANAGE_ROLES,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
      Permission.DELETE_TASKS,
      Permission.CREATE_SPRINTS,
      Permission.EDIT_SPRINTS,
      Permission.DELETE_SPRINTS,
    ],
    hierarchy: 6,
  },
  [ProjectRole.TEAM_LEAD]: {
    name: 'Team Lead',
    description: 'Manages team members and has full task/sprint control',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.EDIT_PROJECT,
      Permission.MANAGE_MEMBERS,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
      Permission.DELETE_TASKS,
      Permission.CREATE_SPRINTS,
      Permission.EDIT_SPRINTS,
      Permission.DELETE_SPRINTS,
    ],
    hierarchy: 5,
  },
  [ProjectRole.DEVELOPER]: {
    name: 'Developer',
    description: 'Can create and edit tasks, participate in sprints',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
      Permission.CREATE_SPRINTS,
      Permission.EDIT_SPRINTS,
    ],
    hierarchy: 4,
  },
  [ProjectRole.DESIGNER]: {
    name: 'Designer',
    description: 'Can create and edit design-related tasks',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
    ],
    hierarchy: 3,
  },
  [ProjectRole.TESTER]: {
    name: 'Tester',
    description: 'Can create and edit testing-related tasks',
    permissions: [
      Permission.VIEW_PROJECT,
      Permission.CREATE_TASKS,
      Permission.EDIT_TASKS,
    ],
    hierarchy: 2,
  },
  [ProjectRole.VIEWER]: {
    name: 'Viewer',
    description: 'Read-only access to project information',
    permissions: [Permission.VIEW_PROJECT],
    hierarchy: 1,
  },
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: ProjectRole | null,
  permission: Permission,
): boolean {
  if (!role || !ROLE_DEFINITIONS[role]) {
    return false;
  }
  return ROLE_DEFINITIONS[role].permissions.includes(permission);
} /**
 * Check if roleA can manage roleB (higher hierarchy can manage lower)
 */
export function canManageRole(
  managerRole: ProjectRole | null,
  targetRole: ProjectRole,
): boolean {
  if (
    !managerRole ||
    !ROLE_DEFINITIONS[managerRole] ||
    !ROLE_DEFINITIONS[targetRole]
  ) {
    return false;
  }

  return (
    ROLE_DEFINITIONS[managerRole].hierarchy >
    ROLE_DEFINITIONS[targetRole].hierarchy
  );
}

/**
 * Get all roles that a given role can assign to others
 */
export function getAssignableRoles(
  managerRole: ProjectRole | null,
): ProjectRole[] {
  if (!managerRole || !ROLE_DEFINITIONS[managerRole]) {
    return [];
  }

  const managerHierarchy = ROLE_DEFINITIONS[managerRole].hierarchy;
  return Object.entries(ROLE_DEFINITIONS)
    .filter(([, definition]) => definition.hierarchy < managerHierarchy)
    .map(([role]) => role as ProjectRole);
}

/**
 * Get user-friendly role display name
 */
export function getRoleDisplayName(role: ProjectRole | null): string {
  if (!role || !ROLE_DEFINITIONS[role]) {
    return 'Unknown Role';
  }
  return ROLE_DEFINITIONS[role].name;
}

/**
 * Get role description
 */
export function getRoleDescription(role: ProjectRole | null): string {
  if (!role || !ROLE_DEFINITIONS[role]) {
    return 'No description available';
  }
  return ROLE_DEFINITIONS[role].description;
}

/**
 * Get all available roles as options for UI components
 */
export function getRoleOptions(): Array<{
  value: ProjectRole;
  label: string;
  description: string;
}> {
  return Object.entries(ROLE_DEFINITIONS).map(([role, definition]) => ({
    value: role as ProjectRole,
    label: definition.name,
    description: definition.description,
  }));
}

/**
 * Check if current user can perform an action based on their role
 */
export function canPerformAction(
  userRole: ProjectRole | null,
  requiredPermission: Permission,
): boolean {
  if (!userRole) return false;
  return hasPermission(userRole, requiredPermission);
}
