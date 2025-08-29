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
  alpha,
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
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  HoverCard,
  SlideIn,
  StaggerContainer,
} from '../components/animations/index.js';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import type { User } from '../types';
import type { Project } from '../types/project';
import { canPerformAction, Permission, ProjectRole } from '../utils/rbac';

interface ProjectMember extends User {
  projectRole?: string;
  joinedAt?: Date;
}

export const TeamManagePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const theme = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [userRole, setUserRole] = useState<ProjectRole | null>(null);
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
    if (!projectId || !currentUser) return;

    try {
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    }
  }, [projectId, currentUser]);

  const loadMembers = useCallback(async () => {
    if (!projectId || !currentUser) {
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
  }, [projectId, currentUser]);

  const loadUserRole = useCallback(async () => {
    if (!projectId || !currentUser) return;

    try {
      const role = await teamService.getUserProjectRole(projectId, 'me');
      setUserRole(role);
    } catch (err) {
      console.error('Error loading user role:', err);
      // Don't set error for role loading as it's not critical
    }
  }, [projectId, currentUser]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadProject(), loadMembers(), loadUserRole()]);
    } finally {
      setLoading(false);
    }
  }, [loadProject, loadMembers, loadUserRole]);

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

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'project_manager':
        return theme.palette.primary.main;
      case 'developer':
        return theme.palette.info.main;
      case 'tester':
        return theme.palette.warning.main;
      case 'viewer':
        return theme.palette.text.secondary;
      default:
        return theme.palette.secondary.main;
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
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (!project) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.primary.main, 0.1)} 0%, 
            ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          px: { xs: 1, sm: 1.5, md: 2 },
          py: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <Box mb={4}>
          <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Alert severity="error">Project not found</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 2, sm: 2.5, md: 3 },
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <SlideIn direction="up">
        {/* Header */}
        <Box mb={6}>
          <Box mb={3}>
            <IconButton
              onClick={handleGoBack}
              sx={{
                mb: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={3}
          >
            <Box display="flex" alignItems="center" gap={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.accent?.main || theme.palette.secondary.main, 0.1)})`,
                }}
              >
                <GroupIcon
                  sx={{
                    color: theme.palette.primary.main,
                    fontSize: 32,
                  }}
                />
              </Box>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Team Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage team members for {project.name}
                  {userRole && (
                    <Chip
                      label={`Your role: ${userRole}`}
                      size="small"
                      color="primary"
                      sx={{ ml: 2 }}
                    />
                  )}
                  {!userRole && (
                    <Chip
                      label="Role: Loading..."
                      size="small"
                      color="default"
                      sx={{ ml: 2 }}
                    />
                  )}
                  {/* Debug info */}
                  <Chip
                    label={`Can manage roles: ${userRole ? canPerformAction(userRole, Permission.MANAGE_ROLES) : 'N/A'}`}
                    size="small"
                    color="secondary"
                    sx={{ ml: 1 }}
                  />
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddMemberDialogOpen(true)}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Add Member
              </Button>

              {/* Project Settings Button - show for all users but with different states */}
              {userRole &&
              canPerformAction(userRole, Permission.MANAGE_ROLES) ? (
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate(`/projects/${projectId}/settings`)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Project Settings
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
                        px: 3,
                        py: 1.5,
                      }}
                    >
                      Project Settings
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setSuccessMessage(null)}
            >
              {successMessage}
            </Alert>
          )}
        </Box>

        {/* Team Statistics */}
        <StaggerContainer>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 3,
              mb: 6,
            }}
          >
            <SlideIn direction="up">
              <HoverCard>
                <Card
                  sx={{
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: theme.shadows[8],
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      display: 'inline-flex',
                      mb: 2,
                    }}
                  >
                    <GroupIcon
                      sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight={700} mb={1}>
                    {members?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Members
                  </Typography>
                </Card>
              </HoverCard>
            </SlideIn>

            <SlideIn direction="up">
              <HoverCard>
                <Card
                  sx={{
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: theme.shadows[8],
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.info.main, 0.1),
                      display: 'inline-flex',
                      mb: 2,
                    }}
                  >
                    <PersonIcon
                      sx={{ color: theme.palette.info.main, fontSize: 28 }}
                    />
                  </Box>
                  <Typography variant="h4" fontWeight={700} mb={1}>
                    {members.filter((m) => m.role === 'developer').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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
              background: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: theme.shadows[8],
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} mb={3}>
                Team Members ({members.length})
              </Typography>

              <List sx={{ p: 0 }}>
                {members.map((member, index) => (
                  <ListItem
                    key={member.id}
                    sx={{
                      borderRadius: 2,
                      mb: index < members.length - 1 ? 2 : 0,
                      background: alpha(theme.palette.background.default, 0.3),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                    secondaryAction={
                      member.id !== project.ownerId &&
                      currentUser?.uid === project.ownerId ? (
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveMember(member.id)}
                          sx={{
                            color: theme.palette.error.main,
                            mr: 1,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.error.main, 0.1),
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
                          bgcolor: alpha(theme.palette.primary.main, 0.2),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {member.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6" fontWeight={600}>
                            {member.displayName}
                          </Typography>
                          {member.id === project.ownerId && (
                            <Chip
                              label="Owner"
                              size="small"
                              sx={{
                                bgcolor: alpha(theme.palette.warning.main, 0.1),
                                color: theme.palette.warning.main,
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {member.email}
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={0.5}
                          >
                            <Chip
                              label={getRoleDisplayName(member.role)}
                              size="small"
                              sx={{
                                bgcolor: alpha(getRoleColor(member.role), 0.1),
                                color: getRoleColor(member.role),
                                fontSize: '0.75rem',
                              }}
                            />
                            {member.projectRole && (
                              <Chip
                                label={member.projectRole}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
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
            background: alpha(theme.palette.background.paper, 0.95),
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
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
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
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
