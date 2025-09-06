import {
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  PriorityHigh as PriorityIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../../services/taskService';
import type { Task } from '../../types/task';
import { formatDateTime } from '../../utils';
import { HoverCard, SlideIn, StaggerContainer } from '../animations';

interface RecentTasksProps {
  projectId: string;
}

const priorityColors: Record<string, string> = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  urgent: '#9c27b0',
};

const statusColors: Record<string, string> = {
  todo: '#2196f3',
  'in-progress': '#ff9800',
  'in-review': '#9c27b0',
  done: '#4caf50',
};

export const RecentTasks: React.FC<RecentTasksProps> = ({ projectId }) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecentTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all tasks and sort by updatedAt to get the most recent
      const allTasks = await taskService.getProjectTasks(projectId);

      // Sort by updatedAt (most recent first) and take the first 5
      const recentTasks = allTasks
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5);

      setTasks(recentTasks);
    } catch (err) {
      console.error('Error loading recent tasks:', err);
      setError('Failed to load recent tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadRecentTasks();
  }, [loadRecentTasks]);

  const handleTaskClick = (taskId: string) => {
    navigate(`/projects/${projectId}/tasks/${taskId}`);
  };

  const formatStatus = (status: string) => {
    return status.replace('-', ' ').toUpperCase();
  };

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  if (loading) {
    return (
      <SlideIn direction="up">
        <Card
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            p: 4,
            textAlign: 'center',
          }}
        >
          <CircularProgress size={40} sx={{ color: 'white', mb: 2 }} />
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            Loading recent tasks...
          </Typography>
        </Card>
      </SlideIn>
    );
  }

  if (error) {
    return (
      <SlideIn direction="up">
        <Alert
          severity="error"
          sx={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {error}
        </Alert>
      </SlideIn>
    );
  }

  return (
    <SlideIn direction="up">
      <Card
        sx={{
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h5" fontWeight={600} sx={{ color: 'white' }}>
              Recent Tasks
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              View All
            </Button>
          </Box>

          {tasks.length === 0 ? (
            <Box
              textAlign="center"
              py={4}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <TaskIcon
                sx={{
                  fontSize: 48,
                  color: 'rgba(255, 255, 255, 0.6)',
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                No tasks yet
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Create your first task to get started
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`/projects/${projectId}/tasks`)}
                sx={{
                  borderRadius: '50px',
                  py: 1,
                  px: 3,
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
                Create Task
              </Button>
            </Box>
          ) : (
            <StaggerContainer>
              <Box display="flex" flexDirection="column" gap={2}>
                {tasks.map((task) => (
                  <HoverCard key={task.id}>
                    <Card
                      sx={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateX(4px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Box flex={1}>
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{
                                color: 'white',
                                mb: 1,
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                              }}
                            >
                              {task.title}
                            </Typography>
                            {task.description && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  mb: 2,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                              >
                                {task.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        <Box
                          display="flex"
                          flexWrap="wrap"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Box display="flex" flexWrap="wrap" gap={1}>
                            <Chip
                              label={formatStatus(task.status)}
                              size="small"
                              sx={{
                                backgroundColor:
                                  statusColors[task.status] || '#666',
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                              }}
                            />
                            <Chip
                              label={formatPriority(task.priority)}
                              size="small"
                              icon={<PriorityIcon sx={{ fontSize: 14 }} />}
                              sx={{
                                backgroundColor:
                                  priorityColors[task.priority] || '#666',
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                '& .MuiChip-icon': {
                                  color: 'white',
                                },
                              }}
                            />
                            {task.assignedToUser && (
                              <Chip
                                label={task.assignedToUser.displayName}
                                size="small"
                                icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  fontWeight: 500,
                                  fontSize: '0.75rem',
                                  '& .MuiChip-icon': {
                                    color: 'white',
                                  },
                                }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.75rem',
                            }}
                          >
                            Updated {formatDateTime(task.updatedAt)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </HoverCard>
                ))}
              </Box>
            </StaggerContainer>
          )}
        </CardContent>
      </Card>
    </SlideIn>
  );
};
