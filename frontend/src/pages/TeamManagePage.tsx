import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Send as SendIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HoverCard,
  SlideIn,
  StaggerContainer,
} from '../components/animations/index.js';
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
  const { currentRole: userRole, canManage } = useProjectRole(projectId!);

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
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-180deg); }
          }
          @keyframes floatMedium {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(90deg); }
          }
        `}
      </style>
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
        {/* Background Circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-3%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            animation: 'floatSlow 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '85%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            animation: 'floatMedium 7s ease-in-out infinite',
          }}
        />
        <SlideIn direction="up">
          {/* Header */}
          <Box mb={6} sx={{ position: 'relative', zIndex: 2 }}>
            <Box mb={3} sx={{ pt: 2 }}>
              <IconButton
                onClick={handleGoBack}
                sx={{
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
              gap={{ xs: 3, sm: 2 }}
              mb={3}
            >
              <Box display="flex" alignItems="center" gap={{ xs: 2, sm: 3 }}>
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <GroupIcon
                    sx={{
                      color: 'white',
                      fontSize: { xs: 24, sm: 32 },
                    }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      mb: 1,
                      fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                    }}
                  >
                    Team Management
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: { xs: 1, sm: 0 },
                    }}
                  >
                    Manage team members for {project.name}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: { xs: 0.5, sm: 1 },
                      mt: { xs: 1, sm: 0.5 },
                    }}
                  >
                    {userRole && (
                      <Chip
                        label={`Your role: ${userRole}`}
                        size="small"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      />
                    )}
                    {!userRole && (
                      <Chip
                        label="Role: Loading..."
                        size="small"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        }}
                      />
                    )}
                    {/* Debug info */}
                    <Chip
                      label={`Can manage roles: ${userRole ? canManage() : 'N/A'}`}
                      size="small"
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 1.5, sm: 2 },
                  alignSelf: { xs: 'stretch', sm: 'auto' },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddMemberDialogOpen(true)}
                  sx={{
                    borderRadius: 3,
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 1.25, sm: 1.5 },
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    Add Member
                  </Box>
                  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Add</Box>
                </Button>

                {/* Project Settings Button - show for all users but with different states */}
                {userRole && canManage() ? (
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => navigate(`/projects/${projectId}/settings`)}
                    sx={{
                      borderRadius: 3,
                      px: { xs: 2.5, sm: 3 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      Project Settings
                    </Box>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      Settings
                    </Box>
                  </Button>
                ) : (
                  <Tooltip
                    title={
                      !userRole
                        ? 'Loading user permissions...'
                        : 'You need role management permissions to access project settings'
                    }
                  >
                    <span>
                      <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        disabled
                        sx={{
                          borderRadius: 3,
                          px: { xs: 2.5, sm: 3 },
                          py: { xs: 1.25, sm: 1.5 },
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        }}
                      >
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                          Project Settings
                        </Box>
                        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                          Settings
                        </Box>
                      </Button>
                    </span>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {successMessage && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
                onClose={() => setSuccessMessage(null)}
              >
                {successMessage}
              </Alert>
            )}
          </Box>
        </SlideIn>

        {/* Team Statistics */}
        <StaggerContainer>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(auto-fit, minmax(200px, 1fr))',
              },
              gap: { xs: 2, sm: 2.5, md: 3 },
              mb: 6,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <SlideIn direction="up">
              <HoverCard>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'inline-flex',
                      mb: 2,
                    }}
                  >
                    <GroupIcon
                      sx={{
                        color: 'white',
                        fontSize: { xs: 24, sm: 28 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={1}
                    sx={{
                      color: 'white',
                      fontSize: { xs: '1.75rem', sm: '2.125rem' },
                    }}
                  >
                    {members?.length || 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    }}
                  >
                    Total Members
                  </Typography>
                </Card>
              </HoverCard>
            </SlideIn>

            <SlideIn direction="up">
              <HoverCard>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'inline-flex',
                      mb: 2,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        color: 'white',
                        fontSize: { xs: 24, sm: 28 },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    mb={1}
                    sx={{
                      color: 'white',
                      fontSize: { xs: '1.75rem', sm: '2.125rem' },
                    }}
                  >
                    {members.filter((m) => m.role === 'developer').length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    }}
                  >
                    Developers
                  </Typography>
                </Card>
              </HoverCard>
            </SlideIn>
          </Box>
        </StaggerContainer>

        {/* Team Members List */}
        <SlideIn direction="up">
          <Card
            sx={{
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
              <Typography
                variant="h5"
                fontWeight={600}
                mb={3}
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                Team Members ({members.length})
              </Typography>

              <List sx={{ p: 0 }}>
                {members.map((member, index) => (
                  <ListItem
                    key={member.id}
                    sx={{
                      borderRadius: 2,
                      mb: index < members.length - 1 ? 2 : 0,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    secondaryAction={
                      member.id !== project.ownerId &&
                      currentUser?.uid === project.ownerId ? (
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveMember(member.id)}
                          sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mr: 1,
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : undefined
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={member.photoURL}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        {member.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          flexDirection={{ xs: 'column', sm: 'row' }}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          gap={{ xs: 0.5, sm: 1 }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                              color: 'white',
                              fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}
                          >
                            {member.displayName}
                          </Typography>
                          {member.id === project.ownerId && (
                            <Chip
                              label="Owner"
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            }}
                          >
                            {member.email}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={{ xs: 0.5, sm: 1 }}
                            mt={0.5}
                          >
                            <Chip
                              label={getRoleDisplayName(member.role)}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              }}
                            />
                            {member.projectRole && (
                              <Chip
                                label={member.projectRole}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                  color: 'white',
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </SlideIn>

        {/* Add Member Dialog */}
        <Dialog
          open={isAddMemberDialogOpen}
          onClose={() => setIsAddMemberDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={600}>
              Add Team Member
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pb: 2 }}>
            {/* Search Users */}
            <Box mb={3}>
              <Typography variant="h6" mb={2}>
                Search Users
              </Typography>
              <TextField
                fullWidth
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchLoading && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {searchResults.length > 0 && (
                <Paper
                  sx={{
                    maxHeight: 200,
                    overflow: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <List dense>
                    {searchResults.map((user) => (
                      <ListItemButton
                        key={user.id}
                        onClick={() => handleAddMember(user.id)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={user.photoURL}
                            sx={{ width: 32, height: 32 }}
                          >
                            {user.displayName.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.displayName}
                          secondary={user.email}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            {/* Invite by Email */}
            <Box>
              <Typography variant="h6" mb={2}>
                Invite by Email
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setIsAddMemberDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleInviteByEmail}
              disabled={!inviteEmail.trim()}
              sx={{
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Send Invitation
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
