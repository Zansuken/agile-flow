import {
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SlideIn, StaggerContainer } from '../components/animations/index.js';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import type { Project } from '../types/project';
import {
  canManageRole,
  canPerformAction,
  getRoleDisplayName,
  getRoleOptions,
  Permission,
  ProjectRole,
  ROLE_DEFINITIONS,
} from '../utils/rbac';

interface ProjectMember {
  id: string;
  email: string;
  displayName: string;
  projectRole?: ProjectRole;
  joinedAt?: Date;
}

export const ProjectSettingsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { currentUser } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [userRole, setUserRole] = useState<ProjectRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load project data and user permissions
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId || !currentUser) return;

      try {
        setLoading(true);
        setError(null);

        // Load project details
        const projectData = await projectService.getProject(projectId);
        setProject(projectData);

        // Load project members
        const membersData = await teamService.getProjectMembers(projectId);
        setMembers(membersData);

        // Get current user's role in this project
        const currentUserRole = await teamService.getUserProjectRole(
          projectId,
          'me',
        );
        setUserRole(currentUserRole);

        // Check if user has permission to manage roles
        if (!canPerformAction(currentUserRole, Permission.MANAGE_ROLES)) {
          setError('You do not have permission to access project settings.');
        }
      } catch (err) {
        console.error('Error loading project data:', err);
        setError('Failed to load project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, currentUser]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleUpdateMemberRole = useCallback(
    async (memberId: string, newRole: ProjectRole) => {
      if (!projectId || !userRole) return;

      try {
        setSaving(true);
        setError(null);

        // Check if user can manage this role
        const member = members.find((m) => m.id === memberId);
        if (
          member?.projectRole &&
          !canManageRole(userRole, member.projectRole)
        ) {
          throw new Error("You cannot manage this user's role.");
        }

        await teamService.updateMemberRole(projectId, memberId, newRole);

        // Update local state
        setMembers((prev) =>
          prev.map((member) =>
            member.id === memberId
              ? { ...member, projectRole: newRole }
              : member,
          ),
        );

        setSuccess(
          `Successfully updated ${member?.displayName}'s role to ${getRoleDisplayName(newRole)}`,
        );
      } catch (err) {
        console.error('Error updating member role:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to update member role.',
        );
      } finally {
        setSaving(false);
      }
    },
    [projectId, userRole, members],
  );

  const handleGoBack = () => {
    navigate(`/projects/${projectId}/team`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography>Loading project settings...</Typography>
      </Box>
    );
  }

  if (!userRole || !canPerformAction(userRole, Permission.MANAGE_ROLES)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" icon={<SecurityIcon />}>
          <Typography variant="h6" gutterBottom>
            Access Denied
          </Typography>
          <Typography>
            You do not have permission to access project settings. Only users
            with role management permissions can view this page.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Back to Team Management
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  const availableRoles = getRoleOptions();

  return (
    <StaggerContainer>
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          p: 3,
        }}
      >
        {/* Header */}
        <SlideIn direction="up">
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton
                onClick={handleGoBack}
                sx={{
                  mr: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 1),
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <SettingsIcon sx={{ mr: 2, fontSize: 28 }} />
              <Typography variant="h4" fontWeight="bold">
                Project Settings
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Manage project permissions and member roles for{' '}
              <strong>{project?.name}</strong>
            </Typography>
          </Box>
        </SlideIn>

        {/* Alert Messages */}
        {error && (
          <SlideIn direction="up">
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </SlideIn>
        )}

        {success && (
          <SlideIn direction="up">
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setSuccess(null)}
            >
              {success}
            </Alert>
          </SlideIn>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {/* Role Definitions Card */}
          <SlideIn direction="left">
            <Card
              sx={{
                flex: '1 1 400px',
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardHeader
                title="Role Definitions"
                subheader="Available roles and their permissions"
                avatar={<SecurityIcon />}
              />
              <CardContent>
                <List>
                  {availableRoles.map((role, index) => (
                    <React.Fragment key={role.value}>
                      <ListItem>
                        <ListItemIcon>
                          <Chip
                            label={ROLE_DEFINITIONS[role.value].hierarchy}
                            size="small"
                            color="primary"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="medium">
                              {role.label}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                              >
                                {role.description}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {ROLE_DEFINITIONS[role.value].permissions.map(
                                  (permission) => (
                                    <Chip
                                      key={permission}
                                      label={permission.replace('_', ' ')}
                                      size="small"
                                      variant="outlined"
                                      sx={{ fontSize: '0.7rem' }}
                                    />
                                  ),
                                )}
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < availableRoles.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Member Role Management Card */}
          <SlideIn direction="right">
            <Card
              sx={{
                flex: '1 1 600px',
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <CardHeader
                title="Member Role Management"
                subheader="Manage roles for project members"
                avatar={<GroupIcon />}
              />
              <CardContent>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Member</TableCell>
                        <TableCell>Current Role</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member) => {
                        const memberRole =
                          member.projectRole || ProjectRole.VIEWER;

                        // Safety check to ensure userRole and memberRole are valid
                        const canEditThisRole =
                          userRole &&
                          memberRole &&
                          canManageRole(userRole, memberRole);
                        const isCurrentUser = member.id === currentUser?.uid;

                        return (
                          <TableRow key={member.id}>
                            <TableCell>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Typography variant="body2" fontWeight="medium">
                                  {member.displayName}
                                </Typography>
                                {isCurrentUser && (
                                  <Chip
                                    label="You"
                                    size="small"
                                    color="primary"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {member.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getRoleDisplayName(memberRole)}
                                color={
                                  memberRole === ProjectRole.OWNER
                                    ? 'error'
                                    : 'default'
                                }
                                variant={
                                  memberRole === ProjectRole.OWNER
                                    ? 'filled'
                                    : 'outlined'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {canEditThisRole &&
                              !isCurrentUser &&
                              memberRole !== ProjectRole.OWNER ? (
                                <FormControl
                                  size="small"
                                  sx={{ minWidth: 120 }}
                                >
                                  <InputLabel>Change Role</InputLabel>
                                  <Select
                                    value={memberRole}
                                    label="Change Role"
                                    onChange={(e) =>
                                      handleUpdateMemberRole(
                                        member.id,
                                        e.target.value as ProjectRole,
                                      )
                                    }
                                    disabled={saving}
                                  >
                                    {availableRoles
                                      .filter(
                                        (role) =>
                                          role.value !== ProjectRole.OWNER &&
                                          userRole &&
                                          canManageRole(userRole, role.value),
                                      )
                                      .map((role) => (
                                        <MenuItem
                                          key={role.value}
                                          value={role.value}
                                        >
                                          {role.label}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                <Tooltip
                                  title={
                                    isCurrentUser
                                      ? 'You cannot change your own role'
                                      : memberRole === ProjectRole.OWNER
                                        ? 'Project owner role cannot be changed'
                                        : "You cannot manage this user's role"
                                  }
                                >
                                  <span>
                                    <Button
                                      size="small"
                                      disabled
                                      startIcon={<WarningIcon />}
                                    >
                                      Cannot Edit
                                    </Button>
                                  </span>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </SlideIn>
        </Box>
      </Box>
    </StaggerContainer>
  );
};
