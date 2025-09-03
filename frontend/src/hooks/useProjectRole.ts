import { useCallback } from 'react';
import { ProjectRole } from '../utils/rbac';
import { useAuth } from './useAuth';

// Use the same roles as defined in RBAC
const PROJECT_ROLES = ProjectRole;

type ProjectUserRole = ProjectRole;

/**
 * Custom hook for project-specific role management
 * Provides easy access to user roles and role-based permissions
 */
export const useProjectRole = (projectId?: string) => {
  const { userRoles, getUserRole, refreshUserRoles, invalidateProjectRole } =
    useAuth();

  // Get the user's role for a specific project
  const currentRole = projectId ? getUserRole(projectId) : null;

  // Helper functions for role checking
  const hasRole = useCallback(
    (role: ProjectUserRole): boolean => {
      return currentRole === role;
    },
    [currentRole],
  );

  const hasMinimumRole = useCallback(
    (minimumRole: ProjectUserRole): boolean => {
      if (!currentRole) return false;

      // Use the same hierarchy as defined in RBAC
      const roleHierarchy: Record<ProjectUserRole, number> = {
        [PROJECT_ROLES.VIEWER]: 1,
        [PROJECT_ROLES.TESTER]: 2,
        [PROJECT_ROLES.DESIGNER]: 3,
        [PROJECT_ROLES.DEVELOPER]: 4,
        [PROJECT_ROLES.TEAM_LEAD]: 5,
        [PROJECT_ROLES.OWNER]: 6,
      };

      return (
        roleHierarchy[currentRole as ProjectUserRole] >=
        roleHierarchy[minimumRole]
      );
    },
    [currentRole],
  );

  // Specific permission checks
  const canView = useCallback((): boolean => {
    return hasMinimumRole(PROJECT_ROLES.VIEWER);
  }, [hasMinimumRole]);

  const canEdit = useCallback((): boolean => {
    return hasMinimumRole(PROJECT_ROLES.DEVELOPER);
  }, [hasMinimumRole]);

  const canManage = useCallback((): boolean => {
    return hasMinimumRole(PROJECT_ROLES.TEAM_LEAD);
  }, [hasMinimumRole]);

  const canManageRoles = useCallback((): boolean => {
    return hasMinimumRole(PROJECT_ROLES.TEAM_LEAD);
  }, [hasMinimumRole]);

  const isOwner = useCallback((): boolean => {
    return hasRole(PROJECT_ROLES.OWNER);
  }, [hasRole]);

  // Helper to invalidate and refresh role for this project
  const refreshProjectRole = useCallback(async () => {
    if (projectId) {
      invalidateProjectRole(projectId);
      await refreshUserRoles();
    }
  }, [projectId, invalidateProjectRole, refreshUserRoles]);

  return {
    // Current role info
    currentRole,
    userRoles,

    // Role checking functions
    hasRole,
    hasMinimumRole,

    // Permission checks
    canView,
    canEdit,
    canManage,
    canManageRoles,
    isOwner,

    // Role management
    refreshProjectRole,
    refreshUserRoles,
    invalidateProjectRole,

    // Helper to get all user's projects
    userProjects: Object.values(userRoles),

    // Role constants for convenience
    ROLES: PROJECT_ROLES,
  };
};

export default useProjectRole;
