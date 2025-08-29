import {
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  FolderOpen as ProjectIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
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
import type { Project } from '../types/project';
import { formatDate, formatDateTime, getDateAge } from '../utils/dateUtils';
import { canPerformAction, Permission, ProjectRole } from '../utils/rbac';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const theme = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<ProjectRole | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId || !currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    Promise.all([loadProject(), loadUserRole()]);
  }, [loadProject, loadUserRole]);

  const handleGoBack = () => {
    navigate('/projects');
  };

  const getProjectStatus = (project: Project) => {
    const daysSinceCreated = getDateAge(project.createdAt);

    if (daysSinceCreated === null) {
      return { status: 'Unknown', color: theme.palette.text.secondary };
    }

    if (daysSinceCreated < 7)
      return { status: 'New', color: theme.palette.info.main };
    if (daysSinceCreated < 30)
      return { status: 'Active', color: theme.palette.success.main };
    return { status: 'Established', color: theme.palette.warning.main };
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
  if (error || !project) {
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
        <Alert severity="error">{error || 'Project not found'}</Alert>
      </Box>
    );
  }

  const statusInfo = getProjectStatus(project);

  // Mock stats - in a real app, these would come from the API
  const stats = [
    {
      title: 'Project Key',
      value: project.key,
      icon: ProjectIcon,
      color: theme.palette.primary.main,
    },
    {
      title: 'Created',
      value: formatDate(project.createdAt),
      icon: CalendarIcon,
      color: theme.palette.info.main,
    },
    {
      title: 'Status',
      value: statusInfo.status,
      icon: TrendingUpIcon,
      color: statusInfo.color,
    },
    {
      title: 'Updated',
      value: formatDate(project.updatedAt),
      icon: SettingsIcon,
      color: theme.palette.warning.main,
    },
  ];

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
                  width: 56,
                  height: 56,
                  p: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.accent?.main || theme.palette.secondary.main, 0.1)})`,
                }}
              >
                <ProjectIcon
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
                  {project.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={statusInfo.status}
                    sx={{
                      backgroundColor: alpha(statusInfo.color, 0.1),
                      color: statusInfo.color,
                      border: `1px solid ${alpha(statusInfo.color, 0.3)}`,
                      fontWeight: 500,
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Project Key: {project.key}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {userRole && canPerformAction(userRole, Permission.MANAGE_ROLES) ? (
              <Button
                variant="contained"
                startIcon={<SettingsIcon />}
                onClick={() => navigate(`/projects/${projectId}/settings`)}
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
                    variant="contained"
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

          <Typography
            variant="body1"
            color="text.secondary"
            lineHeight={1.7}
            mb={4}
          >
            {project.description}
          </Typography>

          <Box mb={4}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Project Information
            </Typography>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {formatDateTime(project.createdAt)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {formatDateTime(project.updatedAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </SlideIn>

      <StaggerContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 3,
            mb: 6,
          }}
        >
          {stats.map((stat, index) => (
            <SlideIn key={index} direction="up">
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
                      background: alpha(stat.color, 0.1),
                      display: 'inline-flex',
                      mb: 2,
                    }}
                  >
                    <stat.icon sx={{ color: stat.color, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" fontWeight={700} mb={1}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Card>
              </HoverCard>
            </SlideIn>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 4,
          }}
        >
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
                  Project Details
                </Typography>
                <Box display="flex" flexDirection="column" gap={3}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Description
                    </Typography>
                    <Typography variant="body1" lineHeight={1.6}>
                      {project.description}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Project Key
                    </Typography>
                    <Chip
                      label={project.key}
                      sx={{
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Current Status
                    </Typography>
                    <Chip
                      label={statusInfo.status}
                      sx={{
                        backgroundColor: alpha(statusInfo.color, 0.1),
                        color: statusInfo.color,
                        border: `1px solid ${alpha(statusInfo.color, 0.3)}`,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </SlideIn>

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
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05,
                        ),
                      },
                    }}
                  >
                    View Tasks
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/projects/${projectId}/team`)}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      borderColor: alpha(theme.palette.secondary.main, 0.3),
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        borderColor: theme.palette.secondary.main,
                        backgroundColor: alpha(
                          theme.palette.secondary.main,
                          0.05,
                        ),
                      },
                    }}
                  >
                    Manage Team
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    Edit Project
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </SlideIn>
        </Box>
      </StaggerContainer>
    </Box>
  );
};
