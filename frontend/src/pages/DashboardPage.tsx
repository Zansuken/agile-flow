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
          minHeight: 'calc(100vh - 64px)', // Subtract navbar height
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {/* Background Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: 'floatSlow 8s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: '80%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.06)',
          animation: 'floatMedium 7s ease-in-out infinite',
        }}
      />

      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <SlideIn direction="up">
          <Box mb={6}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 1,
              }}
            >
              Welcome back, {currentUserData?.displayName || 'User'}!
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                mb: 4,
                fontWeight: 400,
              }}
            >
              Here's what's happening with your projects today.
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/projects')}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 4,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
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
                  borderRadius: '50px',
                  py: 1.5,
                  px: 4,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
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
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.3s ease',
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
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
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
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 600,
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    </Box>

                    <Typography 
                      variant="h4" 
                      fontWeight={700} 
                      gutterBottom
                      sx={{ color: 'white' }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ color: 'white', fontWeight: 600 }}
                    >
                      {stat.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
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
              <Typography 
                variant="h5" 
                fontWeight={600}
                sx={{ color: 'white' }}
              >
                Recent Projects
              </Typography>
              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/projects')}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
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
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 3,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-5px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      },
                      transition: 'all 0.3s ease',
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
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
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
                          sx={{
                            backgroundColor: project.status === 'Completed' 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                        >
                          {project.team} members
                        </Typography>
                      </Box>

                      <Typography 
                        variant="h6" 
                        fontWeight={600} 
                        gutterBottom
                        sx={{ color: 'white' }}
                      >
                        {project.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ 
                          mb: 3,
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
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
                          <Typography 
                            variant="body2" 
                            fontWeight={500}
                            sx={{ color: 'white' }}
                          >
                            Progress
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            sx={{ color: 'white' }}
                          >
                            {project.progress}%
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${project.progress}%`,
                              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>

                      <Typography 
                        variant="body2" 
                        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </HoverCard>
              ))}
            </Box>
          ) : (
            <Box 
              textAlign="center" 
              py={8}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <ProjectIcon
                sx={{
                  fontSize: 80,
                  color: 'rgba(255, 255, 255, 0.6)',
                  mb: 2,
                }}
              />
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ color: 'white' }}
              >
                No projects yet
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Create your first project to get started with AgileFlow
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/projects')}
                sx={{
                  borderRadius: '50px',
                  py: 1.5,
                  px: 4,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              >
                Create Your First Project
              </Button>
            </Box>
          )}
        </StaggerContainer>
      </Container>
    </Box>
    </>
  );
};
