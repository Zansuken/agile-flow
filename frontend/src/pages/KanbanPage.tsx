import {
  Add as AddIcon,
  FlagOutlined as FlagIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  alpha,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      <SlideIn direction="up">
        <Box mb={4}>
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
            Kanban Board
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Project ID: {projectId} • Drag and drop tasks to update their status
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
          }}
        >
          {columns.map((column) => (
            <SlideIn key={column.id} direction="up">
              <Paper
                sx={{
                  borderRadius: 4,
                  background: alpha(theme.palette.background.paper, 0.7),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: theme.shadows[8],
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
                    background: column.color,
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
                    <Typography variant="h6" fontWeight={600}>
                      {column.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={column.tasks.length}
                        size="small"
                        sx={{
                          backgroundColor: alpha(column.color, 0.1),
                          color: column.color,
                          fontWeight: 600,
                        }}
                      />
                      <IconButton size="small">
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
                            background: theme.palette.background.paper,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: theme.shadows[2],
                            cursor: 'grab',
                            '&:active': {
                              cursor: 'grabbing',
                            },
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
                              >
                                {task.title}
                              </Typography>
                              <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={3}
                              lineHeight={1.5}
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
                                    color: getPriorityColor(task.priority),
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: getPriorityColor(task.priority),
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {task.priority}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: 10,
                                    fontWeight: 600,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                                  }}
                                >
                                  {task.avatar}
                                </Avatar>
                              </Box>
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
  );
};
