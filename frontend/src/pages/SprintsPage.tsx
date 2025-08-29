import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Assignment as TaskIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  HoverCard,
  SlideIn,
  StaggerContainer,
} from '../components/animations/index.js';

export const SprintsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();

  const sprints = [
    {
      id: 1,
      name: 'Sprint 1 - Foundation',
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2024-01-29',
      progress: 65,
      totalTasks: 12,
      completedTasks: 8,
      remainingDays: 5,
      statusColor: theme.palette.success.main,
    },
    {
      id: 2,
      name: 'Sprint 2 - Core Features',
      status: 'Planning',
      startDate: '2024-01-30',
      endDate: '2024-02-13',
      progress: 0,
      totalTasks: 15,
      completedTasks: 0,
      remainingDays: 10,
      statusColor: theme.palette.info.main,
    },
    {
      id: 3,
      name: 'Sprint 3 - Integration',
      status: 'Completed',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      progress: 100,
      totalTasks: 10,
      completedTasks: 10,
      remainingDays: 0,
      statusColor: theme.palette.success.main,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <PlayIcon />;
      case 'Completed':
        return <StopIcon />;
      default:
        return <CalendarIcon />;
    }
  };

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={6}
        >
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
              Sprints
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Project ID: {projectId} • Plan and manage your development sprints
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
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
            New Sprint
          </Button>
        </Box>
      </SlideIn>

      <StaggerContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sprints.map((sprint) => (
            <SlideIn key={sprint.id} direction="up">
              <HoverCard>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: alpha(theme.palette.background.paper, 0.7),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: theme.shadows[8],
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={3}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${alpha(sprint.statusColor, 0.1)}, ${alpha(sprint.statusColor, 0.05)})`,
                          }}
                        >
                          {getStatusIcon(sprint.status)}
                        </Box>
                        <Box>
                          <Typography variant="h5" fontWeight={600} mb={0.5}>
                            {sprint.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                            {new Date(sprint.endDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={sprint.status}
                        sx={{
                          backgroundColor: alpha(sprint.statusColor, 0.1),
                          color: sprint.statusColor,
                          border: `1px solid ${alpha(sprint.statusColor, 0.3)}`,
                          fontWeight: 500,
                        }}
                      />
                    </Box>

                    <Box mb={4}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Sprint Progress
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {sprint.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={sprint.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1,
                          ),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                          },
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: 3,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            background: alpha(theme.palette.success.main, 0.1),
                          }}
                        >
                          <TaskIcon
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: 20,
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {sprint.completedTasks}/{sprint.totalTasks}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Tasks Completed
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            background: alpha(theme.palette.warning.main, 0.1),
                          }}
                        >
                          <CalendarIcon
                            sx={{
                              color: theme.palette.warning.main,
                              fontSize: 20,
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {sprint.remainingDays}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Days Remaining
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            background: alpha(theme.palette.info.main, 0.1),
                          }}
                        >
                          <TrendingUpIcon
                            sx={{
                              color: theme.palette.info.main,
                              fontSize: 20,
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {Math.round(
                              (sprint.completedTasks / sprint.totalTasks) * 100,
                            )}
                            %
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Completion Rate
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      gap={2}
                      mt={3}
                      pt={3}
                      borderTop={`1px solid ${alpha(theme.palette.divider, 0.1)}`}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
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
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.accent?.main || theme.palette.secondary.main, 0.8)})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                          },
                        }}
                      >
                        {sprint.status === 'Active'
                          ? 'Manage Sprint'
                          : sprint.status === 'Planning'
                            ? 'Start Sprint'
                            : 'View Summary'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </HoverCard>
            </SlideIn>
          ))}
        </Box>
      </StaggerContainer>
    </Box>
  );
};
