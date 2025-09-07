import {
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
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
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SlideIn, StaggerContainer, FloatingCircles } from '../components/animations/index.js';
import { useAuth } from '../hooks/useAuth';
import { useProjectRole } from '../hooks/useProjectRole';
import { projectService } from '../services/projectService';
import { teamService } from '../services/teamService';
import type { Project } from '../types/project';
import { formatDateTime } from '../utils/dateUtils';
import {
  getRoleDisplayName,
  getRoleOptions,
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
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { currentUser } = useAuth();
  const { currentRole: userRole, canManageRoles } = useProjectRole(projectId!);

  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load project data and user permissions
  useEffect(() => {
    console.debug(
      '🔄 ProjectSettingsPage: Loading project data for projectId:',
      projectId,
    );

    const loadProjectData = async () => {
      if (!projectId || !currentUser) {
        console.debug(
          '❌ ProjectSettingsPage: Missing projectId or currentUser',
        );
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load project details
        const projectData = await projectService.getProject(projectId);
        setProject(projectData);
        console.debug(
          '✅ ProjectSettingsPage: Project data loaded:',
          projectData.name,
        );

        // Load project members
        const membersData = await teamService.getProjectMembers(projectId);
        setMembers(membersData);
        console.debug(
          '✅ ProjectSettingsPage: Members data loaded:',
          membersData.length,
          'members',
        );
      } catch (err) {
        console.error('Error loading project data:', err);
        setError('Failed to load project data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, currentUser]); // Remove canManageRoles from dependencies

  // Check permissions after role is loaded (only when userRole changes)
  useEffect(() => {
    console.debug(
      '🔑 ProjectSettingsPage: Checking permissions for userRole:',
      userRole,
    );

    if (!userRole) return; // Don't check permissions if role isn't loaded yet

    if (!canManageRoles()) {
      console.debug(
        '❌ ProjectSettingsPage: User does not have permission to manage roles',
      );
      setError('You do not have permission to access project settings.');
    } else {
      console.debug(
        '✅ ProjectSettingsPage: User has permission to manage roles',
      );
      // Clear permission error if user has permission
      setError((prev) =>
        prev === 'You do not have permission to access project settings.'
          ? null
          : prev,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]); // Only depend on userRole, call canManageRoles inside

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

        // Check if user can manage roles
        if (!canManageRoles()) {
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

        const updatedMember = members.find((m) => m.id === memberId);
        setSuccess(
          `Successfully updated ${updatedMember?.displayName}'s role to ${getRoleDisplayName(newRole)}`,
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
    [projectId, userRole, members, canManageRoles], // canManageRoles is now stable with useCallback
  );

  const handleGoBack = () => {
    navigate(`/projects/${projectId}/team`);
  };

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
            justifyContent: 'center',
            alignItems: 'center',
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
          <Typography sx={{ color: 'white' }}>
            Loading project settings...
          </Typography>
        </Box>
      </>
    );
  }

  if (!userRole || !canManageRoles()) {
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
          <Alert
            severity="error"
            icon={<SecurityIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Access Denied
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              You do not have permission to access project settings. Only users
              with role management permissions can view this page.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                sx={{
                  mt: 2,
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Back to Team Management
              </Button>
            </Box>
          </Alert>
        </Box>
      </>
    );
  }

  const availableRoles = getRoleOptions();

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
      <StaggerContainer>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            p: 3,
          }}
        >
          {/* Background Circles */}
          <FloatingCircles variant="default" />

          {/* Header */}
          <SlideIn direction="up">
            <Box sx={{ mb: 4, position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pt: 2 }}>
                <IconButton
                  onClick={handleGoBack}
                  sx={{
                    mr: 2,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                    },
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                <SettingsIcon sx={{ mr: 2, fontSize: 28, color: 'white' }} />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{ color: 'white' }}
                >
                  Project Settings
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
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
                sx={{
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  position: 'relative',
                  zIndex: 2,
                }}
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
                sx={{
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  position: 'relative',
                  zIndex: 2,
                }}
                onClose={() => setSuccess(null)}
              >
                {success}
              </Alert>
            </SlideIn>
          )}

          {/* Project Information Section */}
          <SlideIn direction="up">
            <Card
              sx={{
                mb: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Project Information
                  </Typography>
                }
                subheader={
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    General information about this project
                  </Typography>
                }
                avatar={<InfoIcon sx={{ color: 'white' }} />}
              />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Box>
                    <Typography
                      variant="body2"
                      mb={1}
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Project Name
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{ color: 'white' }}
                    >
                      {project?.name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      mb={1}
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Description
                    </Typography>
                    <Typography
                      variant="body1"
                      lineHeight={1.6}
                      sx={{ color: 'white' }}
                    >
                      {project?.description}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      mb={1}
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Project Key
                    </Typography>
                    <Chip
                      label={project?.key}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        mb={1}
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        Created
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ color: 'white' }}
                      >
                        {project?.createdAt
                          ? formatDateTime(project.createdAt)
                          : 'N/A'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        mb={1}
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        Last Updated
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ color: 'white' }}
                      >
                        {project?.updatedAt
                          ? formatDateTime(project.updatedAt)
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      mb={1}
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Status
                    </Typography>
                    <Chip
                      label={project?.status?.toUpperCase() || 'UNKNOWN'}
                      sx={{
                        backgroundColor:
                          project?.status === 'active'
                            ? 'rgba(76, 175, 80, 0.3)'
                            : 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </SlideIn>

          <Box
            sx={{
              display: { xs: 'flex', md: 'flex' },
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              zIndex: 2,
            }}
          >
            {/* Role Definitions Card */}
            <SlideIn direction="left">
              <Card
                sx={{
                  flex: { xs: '1 1 auto', md: '1 1 400px' },
                  minWidth: { xs: '100%', md: '400px' },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      Role Definitions
                    </Typography>
                  }
                  subheader={
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Available roles and their permissions
                    </Typography>
                  }
                  avatar={<SecurityIcon sx={{ color: 'white' }} />}
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
                              sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                              }}
                            />
                          </ListItemIcon>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="medium"
                              sx={{ color: 'white' }}
                            >
                              {role.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1,
                                color: 'rgba(255, 255, 255, 0.8)',
                              }}
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
                                    sx={{
                                      fontSize: '0.7rem',
                                      borderColor: 'rgba(255, 255, 255, 0.3)',
                                      color: 'white',
                                    }}
                                  />
                                ),
                              )}
                            </Box>
                          </Box>
                        </ListItem>
                        {index < availableRoles.length - 1 && (
                          <Divider
                            sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                          />
                        )}
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
                  flex: { xs: '1 1 auto', md: '1 1 600px' },
                  minWidth: { xs: '100%', md: '600px' },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardHeader
                  title={
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      Member Role Management
                    </Typography>
                  }
                  subheader={
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Manage roles for project members
                    </Typography>
                  }
                  avatar={<GroupIcon sx={{ color: 'white' }} />}
                />
                <CardContent>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: 2,
                    }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Member
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Current Role
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {members.map((member) => {
                          const memberRole =
                            member.projectRole || ProjectRole.VIEWER;

                          // Safety check to ensure user can manage roles
                          const canEditThisRole = canManageRoles();
                          const isCurrentUser = member.id === currentUser?.uid;

                          return (
                            <TableRow key={member.id}>
                              <TableCell
                                sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                              >
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontWeight="medium"
                                    sx={{ color: 'white' }}
                                  >
                                    {member.displayName}
                                  </Typography>
                                  {isCurrentUser && (
                                    <Chip
                                      label="You"
                                      size="small"
                                      sx={{
                                        ml: 1,
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        border:
                                          '1px solid rgba(255, 255, 255, 0.3)',
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                >
                                  {member.email}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                              >
                                <Chip
                                  label={getRoleDisplayName(memberRole)}
                                  sx={{
                                    background:
                                      memberRole === ProjectRole.OWNER
                                        ? 'rgba(255, 255, 255, 0.25)'
                                        : 'rgba(255, 255, 255, 0.15)',
                                    color: 'white',
                                    border:
                                      '1px solid rgba(255, 255, 255, 0.3)',
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                              >
                                {canEditThisRole &&
                                !isCurrentUser &&
                                memberRole !== ProjectRole.OWNER ? (
                                  <FormControl
                                    size="small"
                                    sx={{
                                      minWidth: 120,
                                      '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        '& fieldset': {
                                          borderColor:
                                            'rgba(255, 255, 255, 0.3)',
                                        },
                                        '&:hover fieldset': {
                                          borderColor:
                                            'rgba(255, 255, 255, 0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor:
                                            'rgba(255, 255, 255, 0.7)',
                                        },
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.8)',
                                      },
                                    }}
                                  >
                                    <InputLabel
                                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                    >
                                      Change Role
                                    </InputLabel>
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
                                      sx={{ color: 'white' }}
                                    >
                                      {availableRoles
                                        .filter(
                                          (role) =>
                                            role.value !== ProjectRole.OWNER &&
                                            canManageRoles(),
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
                                        sx={{
                                          color: 'rgba(255, 255, 255, 0.5)',
                                          borderColor:
                                            'rgba(255, 255, 255, 0.2)',
                                        }}
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
    </>
  );
};
