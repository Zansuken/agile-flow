import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Assignment as TaskIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
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
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 4 },
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={6}
            sx={{ position: 'relative', zIndex: 2 }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 1,
                }}
              >
                Sprints
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Project ID: {projectId} • Plan and manage your development
                sprints
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              New Sprint
            </Button>
          </Box>
        </SlideIn>

        <StaggerContainer>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {sprints.map((sprint) => (
              <SlideIn key={sprint.id} direction="up">
                <HoverCard>
                  <Card
                    sx={{
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background:
                          'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
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
                              background: 'rgba(255, 255, 255, 0.2)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            {getStatusIcon(sprint.status)}
                          </Box>
                          <Box>
                            <Typography
                              variant="h5"
                              fontWeight={600}
                              mb={0.5}
                              sx={{ color: 'white' }}
                            >
                              {sprint.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                            >
                              {new Date(sprint.startDate).toLocaleDateString()}{' '}
                              - {new Date(sprint.endDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={sprint.status}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
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
                          <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                          >
                            Sprint Progress
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ color: 'white' }}
                          >
                            {sprint.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={sprint.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background:
                                'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
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
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <TaskIcon
                              sx={{
                                color: 'white',
                                fontSize: 20,
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{ color: 'white' }}
                            >
                              {sprint.completedTasks}/{sprint.totalTasks}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                            >
                              Tasks Completed
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1.5,
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <CalendarIcon
                              sx={{
                                color: 'white',
                                fontSize: 20,
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{ color: 'white' }}
                            >
                              {sprint.remainingDays}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                            >
                              Days Remaining
                            </Typography>
                          </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1.5,
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <TrendingUpIcon
                              sx={{
                                color: 'white',
                                fontSize: 20,
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{ color: 'white' }}
                            >
                              {Math.round(
                                (sprint.completedTasks / sprint.totalTasks) *
                                  100,
                              )}
                              %
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                            >
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
                        borderTop="1px solid rgba(255, 255, 255, 0.2)"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.3)',
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
    </>
  );
};
