import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  FolderOpen as ProjectIcon,
  Assignment as TaskIcon,
  People as TeamIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { StaggerContainer, SlideIn, HoverCard } from '../components/animations/index.js';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserData } = useAuth();
  const theme = useTheme();

  const stats = [
    {
      title: 'Total Projects',
      value: '5',
      subtitle: '3 active',
      icon: ProjectIcon,
      color: theme.palette.primary.main,
      trend: '+12%',
    },
    {
      title: 'Active Tasks',
      value: '23',
      subtitle: '8 completed today',
      icon: TaskIcon,
      color: theme.palette.secondary.main,
      trend: '+5%',
    },
    {
      title: 'Team Members',
      value: '12',
      subtitle: '3 online now',
      icon: TeamIcon,
      color: theme.palette.success.main,
      trend: '+2',
    },
    {
      title: 'Sprint Progress',
      value: '68%',
      subtitle: '12 days remaining',
      icon: TrendingUpIcon,
      color: theme.palette.warning.main,
      trend: '+15%',
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'AgileFlow Dashboard',
      description: 'Modern project management dashboard with real-time collaboration',
      progress: 85,
      team: 5,
      dueDate: '2024-02-15',
      status: 'In Progress',
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      description: 'Complete UX/UI overhaul of the mobile application',
      progress: 45,
      team: 3,
      dueDate: '2024-03-01',
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Third-party API integration for enhanced functionality',
      progress: 100,
      team: 2,
      dueDate: '2024-01-20',
      status: 'Completed',
    },
  ];

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
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Here's what's happening with your projects today.
          </Typography>
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
          {stats.map((stat) => (
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
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
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
                  borderRadius: 3,
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
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Chip
                      label={project.status}
                      size="small"
                      color={project.status === 'Completed' ? 'success' : 'primary'}
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {project.team} members
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {project.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {project.description}
                  </Typography>
                  
                  <Box mb={2}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
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
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
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
      </StaggerContainer>
    </Container>
  );
};
