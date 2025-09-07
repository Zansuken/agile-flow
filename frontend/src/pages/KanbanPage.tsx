import {
  Add as AddIcon,
  FlagOutlined as FlagIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import {
  FloatingCircles,
  HoverCard,
  SlideIn,
  StaggerContainer,
} from '../components/animations/index.js';

export const KanbanPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const theme = useTheme();

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: theme.palette.info.main,
      tasks: [
        {
          id: '1',
          title: 'User Authentication System',
          description: 'Implement JWT-based authentication with refresh tokens',
          priority: 'high',
          assignee: 'John Doe',
          avatar: 'JD',
        },
        {
          id: '2',
          title: 'Database Migration',
          description: 'Update database schema for new features',
          priority: 'medium',
          assignee: 'Jane Smith',
          avatar: 'JS',
        },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      color: theme.palette.warning.main,
      tasks: [
        {
          id: '3',
          title: 'API Documentation',
          description: 'Create comprehensive API documentation with examples',
          priority: 'medium',
          assignee: 'Bob Wilson',
          avatar: 'BW',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      color: theme.palette.primary.main,
      tasks: [
        {
          id: '4',
          title: 'Frontend Components',
          description: 'Build reusable UI components for the dashboard',
          priority: 'low',
          assignee: 'Alice Brown',
          avatar: 'AB',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: theme.palette.success.main,
      tasks: [
        {
          id: '5',
          title: 'Project Setup',
          description: 'Initialize project structure and dependencies',
          priority: 'high',
          assignee: 'Charlie Davis',
          avatar: 'CD',
        },
      ],
    },
  ];

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
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 1, sm: 1.5, md: 2 },
          py: { xs: 2, sm: 2.5, md: 3 },
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        {/* Background Circles */}
        <FloatingCircles variant="default" />

        <SlideIn direction="up">
          <Box mb={4} sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 1,
              }}
            >
              Kanban Board
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Project ID: {projectId} • Drag and drop tasks to update their
              status
            </Typography>
          </Box>
        </SlideIn>

        <StaggerContainer>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: { xs: 2, sm: 3 },
              width: '100%',
              maxWidth: '100%',
              overflowX: 'auto',
              pb: 2,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {columns.map((column) => (
              <SlideIn key={column.id} direction="up">
                <Paper
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    minHeight: 500,
                    position: 'relative',
                    width: '100%',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background:
                        'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
                      borderRadius: '16px 16px 0 0',
                    },
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ color: 'white' }}
                      >
                        {column.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={column.tasks.length}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                          }}
                        />
                        <IconButton size="small" sx={{ color: 'white' }}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                      {column.tasks.map((task) => (
                        <HoverCard key={task.id}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                              cursor: 'grab',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.15)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                              },
                              '&:active': {
                                cursor: 'grabbing',
                              },
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <CardContent sx={{ p: 2.5 }}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                mb={2}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  lineHeight={1.3}
                                  sx={{ color: 'white' }}
                                >
                                  {task.title}
                                </Typography>
                                <IconButton
                                  size="small"
                                  sx={{ color: 'white' }}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  mb: 3,
                                  lineHeight: 1.5,
                                }}
                              >
                                {task.description}
                              </Typography>

                              <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Box display="flex" alignItems="center" gap={1}>
                                  <FlagIcon
                                    sx={{
                                      fontSize: 16,
                                      color: 'rgba(255, 255, 255, 0.8)',
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'rgba(255, 255, 255, 0.8)',
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {task.priority}
                                  </Typography>
                                </Box>
                                <Avatar
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    fontSize: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    border:
                                      '1px solid rgba(255, 255, 255, 0.3)',
                                  }}
                                >
                                  {task.avatar}
                                </Avatar>
                              </Box>
                            </CardContent>
                          </Card>
                        </HoverCard>
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </SlideIn>
            ))}
          </Box>
        </StaggerContainer>
      </Box>
    </>
  );
};
