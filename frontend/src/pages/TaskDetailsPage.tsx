import { ArrowBack, Cancel, Check, Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUser,
  UpdateTaskDto,
} from '../types/task';

export const TaskDetailsPage: React.FC = () => {
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Editing state
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
    tags: [] as string[],
  });

  const [userOptions, setUserOptions] = useState<TaskUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const authContext = useContext(AuthContext);
  const currentUser = authContext?.currentUser;

  const loadTask = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const taskData = await taskService.getTask(taskId);
      setTask(taskData);

      // Set edit data
      setEditData({
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: taskData.priority,
        assignedTo: taskData.assignedTo || '',
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate).toISOString().split('T')[0]
          : '',
        estimatedHours: taskData.estimatedHours?.toString() || '',
        tags: taskData.tags || [],
      });
    } catch (error) {
      console.error('Error loading task:', error);
      setError('Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setUserOptions([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const users = await userService.searchUsers(query);
      setUserOptions(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleSave = async () => {
    if (!task) return;

    try {
      const updateData: UpdateTaskDto = {
        title: editData.title,
        description: editData.description || undefined,
        status: editData.status,
        priority: editData.priority,
        assignedTo: editData.assignedTo || undefined,
        dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
        estimatedHours: editData.estimatedHours
          ? parseInt(editData.estimatedHours)
          : undefined,
        tags: editData.tags.length > 0 ? editData.tags : undefined,
      };

      await taskService.updateTask(task.id, updateData);
      await loadTask(); // Reload task to get updated data
      setEditing(false);
      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update task',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      await taskService.deleteTask(task.id);
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success',
      });
      navigate(`/projects/${projectId}/tasks`);
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete task',
        severity: 'error',
      });
    }
  };

  const handleAssignToMe = () => {
    if (currentUser) {
      setEditData({ ...editData, assignedTo: currentUser.uid });
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'default';
      case 'in_progress':
        return 'primary';
      case 'in_review':
        return 'warning';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'default';
      case 'medium':
        return 'info';
      case 'high':
        return 'warning';
      case 'urgent':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading task...
        </Typography>
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Alert severity="error">{error || 'Task not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
              sx={{ color: 'white', mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              {editing ? (
                <TextField
                  fullWidth
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  variant="outlined"
                  placeholder="Task title"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h4"
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {task.title}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {editing ? (
                <>
                  <IconButton onClick={handleSave} sx={{ color: 'white' }}>
                    <Check />
                  </IconButton>
                  <IconButton
                    onClick={() => setEditing(false)}
                    sx={{ color: 'white' }}
                  >
                    <Cancel />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => setEditing(true)}
                    sx={{ color: 'white' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => setDeleteConfirmOpen(true)}
                    sx={{ color: 'white' }}
                  >
                    <Delete />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Task Details */}
          <Grid container spacing={3}>
            {/* Description */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Description
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  variant="outlined"
                  placeholder="Task description"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  }}
                />
              ) : (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {task.description || 'No description provided'}
                </Typography>
              )}
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Status
              </Typography>
              {editing ? (
                <FormControl fullWidth>
                  <Select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    variant="outlined"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="in_review">In Review</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Chip
                  label={task.status.replace('_', ' ').toUpperCase()}
                  color={getStatusColor(task.status)}
                />
              )}
            </Grid>

            {/* Priority */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Priority
              </Typography>
              {editing ? (
                <FormControl fullWidth>
                  <Select
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        priority: e.target.value as TaskPriority,
                      })
                    }
                    variant="outlined"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                    }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Chip
                  label={task.priority.toUpperCase()}
                  color={getPriorityColor(task.priority)}
                />
              )}
            </Grid>

            {/* Assignee */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Assignee
              </Typography>
              {editing ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Autocomplete
                    fullWidth
                    options={userOptions}
                    getOptionLabel={(option) =>
                      option.displayName || option.email
                    }
                    value={
                      userOptions.find((u) => u.id === editData.assignedTo) ||
                      null
                    }
                    onChange={(_, newValue) =>
                      setEditData({
                        ...editData,
                        assignedTo: newValue?.id || '',
                      })
                    }
                    onInputChange={(_, value) => searchUsers(value)}
                    loading={searchingUsers}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search users..."
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                          },
                        }}
                      />
                    )}
                  />
                  {currentUser && (
                    <Button
                      onClick={handleAssignToMe}
                      variant="outlined"
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: 'white',
                        },
                      }}
                    >
                      Me
                    </Button>
                  )}
                </Box>
              ) : (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {task.assignedToUser?.displayName || 'Unassigned'}
                </Typography>
              )}
            </Grid>

            {/* Due Date */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Due Date
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) =>
                    setEditData({ ...editData, dueDate: e.target.value })
                  }
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  }}
                />
              ) : (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {task.dueDate
                    ? formatDate(new Date(task.dueDate))
                    : 'No due date set'}
                </Typography>
              )}
            </Grid>

            {/* Estimated Hours */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Estimated Hours
              </Typography>
              {editing ? (
                <TextField
                  fullWidth
                  type="number"
                  value={editData.estimatedHours}
                  onChange={(e) =>
                    setEditData({ ...editData, estimatedHours: e.target.value })
                  }
                  placeholder="Estimated hours"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  }}
                />
              ) : (
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {task.estimatedHours
                    ? `${task.estimatedHours} hours`
                    : 'Not estimated'}
                </Typography>
              )}
            </Grid>

            {/* Created By */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Created By
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {task.createdByUser?.displayName || 'Unknown'}
              </Typography>
            </Grid>

            {/* Created At */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Created
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {formatDate(new Date(task.createdAt))}
              </Typography>
            </Grid>

            {/* Updated At */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                Last Updated
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {formatDate(new Date(task.updatedAt))}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Delete Task</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
