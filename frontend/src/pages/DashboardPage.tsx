import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  FolderOpen as ProjectIcon,
  Refresh as RefreshIcon,
  Assignment as TaskIcon,
  People as TeamIcon,
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
  Container,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HoverCard,
  SlideIn,
  StaggerContainer,
} from '../components/animations/index.js';
import { useAuth } from '../hooks/useAuth.js';
import {
  dashboardService,
  type DashboardStats,
  type RecentProject,
} from '../services/dashboardService.js';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserData, currentUser } = useAuth();
  const theme = useTheme();

  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Load stats and recent projects in parallel
      const [dashboardStats, projects] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProjects(6),
      ]);

      setStats(dashboardStats);
      setRecentProjects(projects);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Create display stats from real data
  const displayStats = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects?.toString() || '0',
      subtitle: `${stats?.activeProjects || 0} active`,
      icon: ProjectIcon,
      color: theme.palette.primary.main,
      trend: stats?.totalProjects
        ? `${stats.activeProjects}/${stats.totalProjects}`
        : '0/0',
    },
    {
      title: 'Active Tasks',
      value: stats?.activeTasks?.toString() || '0',
      subtitle: `${stats?.completedTasks || 0} completed`,
      icon: TaskIcon,
      color: theme.palette.secondary.main,
      trend: stats?.totalTasks
        ? `${stats.completedTasks}/${stats.totalTasks}`
        : '0/0',
    },
    {
      title: 'Team Members',
      value: stats?.totalMembers?.toString() || '0',
      subtitle: `${stats?.onlineMembers || 0} online now`,
      icon: TeamIcon,
      color: theme.palette.success.main,
      trend: stats?.onlineMembers ? `+${stats.onlineMembers}` : '+0',
    },
    {
      title: 'Project Progress',
      value: stats?.totalProjects
        ? `${Math.round((stats.activeProjects / stats.totalProjects) * 100)}%`
        : '0%',
      subtitle: `${stats?.totalProjects || 0} total projects`,
      icon: TrendingUpIcon,
      color: theme.palette.warning.main,
      trend: stats?.activeProjects ? `+${stats.activeProjects}` : '+0',
    },
  ];

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <SlideIn direction="up">
        <Box mb={6}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Welcome back, {currentUserData?.displayName || 'User'}!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Here's what's happening with your projects today.
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/projects')}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: theme.shadows[8],
                '&:hover': {
                  boxShadow: theme.shadows[12],
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create New Project
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadDashboardData}
              disabled={loading}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 3,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
                transition: 'all 0.3s ease',
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </SlideIn>

      {/* Stats Cards */}
      <StaggerContainer>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {displayStats.map((stat) => (
            <HoverCard key={stat.title}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)}, ${alpha(stat.color, 0.05)})`,
                  border: `1px solid ${alpha(stat.color, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: alpha(stat.color, 0.15),
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <stat.icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Chip
                      label={stat.trend}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {stat.value}
                  </Typography>

                  <Typography variant="h6" color="text.primary" gutterBottom>
                    {stat.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {stat.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            </HoverCard>
          ))}
        </Box>
      </StaggerContainer>

      {/* Recent Projects Section */}
      <SlideIn direction="up">
        <Box mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h5" fontWeight={600}>
              Recent Projects
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/projects')}
              sx={{ color: theme.palette.primary.main }}
            >
              View All Projects
            </Button>
          </Box>
        </Box>
      </SlideIn>

      {/* Projects Grid */}
      <StaggerContainer>
        {recentProjects.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {recentProjects.map((project) => (
              <HoverCard key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Chip
                        label={project.status}
                        size="small"
                        color={
                          project.status === 'Completed' ? 'success' : 'primary'
                        }
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {project.team} members
                      </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {project.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {project.description}
                    </Typography>

                    <Box mb={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          Progress
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {project.progress}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1,
                          ),
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${project.progress}%`,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </HoverCard>
            ))}
          </Box>
        ) : (
          <Box textAlign="center" py={8}>
            <ProjectIcon
              sx={{
                fontSize: 80,
                color: 'text.disabled',
                mb: 2,
              }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No projects yet
            </Typography>
            <Typography variant="body1" color="text.disabled" sx={{ mb: 3 }}>
              Create your first project to get started with AgileFlow
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/projects')}
              sx={{
                borderRadius: 3,
                py: 1.5,
                px: 3,
              }}
            >
              Create Your First Project
            </Button>
          </Box>
        )}
      </StaggerContainer>
    </Container>
  );
};
