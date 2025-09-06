import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Alert, Box, CircularProgress, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AddMemberDialog,
  TeamManageBackground,
  TeamManageHeader,
  TeamMembersList,
  TeamStatsCards,
} from '../components/team-manage/index.js';
import { useAuth } from '../hooks/useAuth';
import { useProjectRole } from '../hooks/useProjectRole';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import type { User } from '../types';
import type { Project } from '../types/project';

interface ProjectMember extends User {
  projectRole?: string;
  joinedAt?: Date;
}

export const TeamManagePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { canManage } = useProjectRole(projectId!);

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add member dialog state
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const loadProject = useCallback(async () => {
    if (!projectId) return;

    try {
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    }
  }, [projectId]); // Remove currentUser dependency as it's handled by auth guard

  const loadMembers = useCallback(async () => {
    if (!projectId) {
      return;
    }

    try {
      const membersData = await teamService.getProjectMembers(projectId);
      setMembers(membersData || []);
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load team members');
      setMembers([]); // Ensure members is always an array
    }
  }, [projectId]); // Remove currentUser dependency as it's handled by auth guard

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadProject(), loadMembers()]);
    } finally {
      setLoading(false);
    }
  }, [loadProject, loadMembers]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [successMessage]);

  // Search users with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await teamService.searchUsers(searchQuery);
        // Filter out users who are already members
        const memberIds = new Set(members.map((member) => member.id));
        setSearchResults(results.filter((user) => !memberIds.has(user.id)));
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, members]);

  const handleGoBack = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleAddMember = async (userId: string) => {
    if (!projectId) return;

    try {
      setError(null);
      setSuccessMessage(null);

      await teamService.addMember({ projectId, memberId: userId });
      await loadMembers(); // Refresh members list
      setIsAddMemberDialogOpen(false);
      setSearchQuery('');
      setSearchResults([]);
      setSuccessMessage('Member added to project successfully');
    } catch {
      setError('Failed to add member to project');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!projectId || !project) return;

    // Prevent removing the project owner
    if (userId === project.ownerId) {
      setError('Cannot remove project owner');
      return;
    }

    try {
      setError(null);
      setSuccessMessage(null);

      await teamService.removeMember({ projectId, memberId: userId });
      await loadMembers(); // Refresh members list
      setSuccessMessage('Member removed from project successfully');
    } catch {
      setError('Failed to remove member from project');
    }
  };

  const handleInviteByEmail = async () => {
    if (!projectId || !inviteEmail.trim()) return;

    try {
      setError(null);
      setSuccessMessage(null);

      const result = await teamService.inviteUserByEmail(
        projectId,
        inviteEmail,
      );
      setInviteEmail('');
      setIsAddMemberDialogOpen(false);

      if (result.success) {
        // Refresh members list if user was successfully added
        await loadMembers();
        setSuccessMessage(result.message);
      } else {
        // Show the message (e.g., user not found, already a member)
        setError(result.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send invitation';
      setError(errorMessage);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'project_manager':
        return 'Project Manager';
      case 'developer':
        return 'Developer';
      case 'tester':
        return 'Tester';
      case 'viewer':
        return 'Viewer';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
          `}
        </style>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
          <CircularProgress size={60} sx={{ color: 'white' }} />
        </Box>
      </>
    );
  }

  // Error state
  if (!project) {
    return (
      <>
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
          `}
        </style>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 1, sm: 1.5, md: 2 },
            py: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 6s ease-in-out infinite',
            }}
          />
          <Box mb={4} sx={{ position: 'relative', zIndex: 2, pt: 2 }}>
            <IconButton
              onClick={handleGoBack}
              sx={{
                color: 'white',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Alert
            severity="error"
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              position: 'relative',
              zIndex: 2,
            }}
          >
            Project not found
          </Alert>
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
        py: { xs: 2, sm: 2.5, md: 3 },
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <TeamManageBackground />

      {error && (
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            position: 'relative',
            zIndex: 2,
            mb: 3,
          }}
        >
          <Alert
            severity="error"
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Box>
      )}

      {successMessage && (
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            position: 'relative',
            zIndex: 2,
            mb: 3,
          }}
        >
          <Alert
            severity="success"
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        </Box>
      )}

      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <TeamManageHeader
          project={project}
          onAddMember={() => setIsAddMemberDialogOpen(true)}
        />

        <TeamStatsCards members={members} />

        <TeamMembersList
          members={members}
          project={project}
          canManage={canManage}
          currentUserId={currentUser?.uid}
          onRemoveMember={handleRemoveMember}
          getRoleDisplayName={getRoleDisplayName}
        />

        <AddMemberDialog
          open={isAddMemberDialogOpen}
          onClose={() => setIsAddMemberDialogOpen(false)}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchResults={searchResults}
          searchLoading={searchLoading}
          inviteEmail={inviteEmail}
          onInviteEmailChange={setInviteEmail}
          onAddMember={handleAddMember}
          onInviteByEmail={handleInviteByEmail}
        />
      </Box>
    </Box>
  );
};
