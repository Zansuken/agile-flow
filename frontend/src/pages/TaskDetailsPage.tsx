import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TaskComments,
  TaskDescription,
  TaskDetailsSidebar,
  TaskHeader,
  type TaskEditData,
} from '../components/task-details';
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
    severity: 'info' as 'error' | 'warning' | 'info' | 'success',
  });

  // Editing state
  const [editData, setEditData] = useState<TaskEditData>({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
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

      // Initialize edit data
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
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const handleSave = async () => {
    if (!task || !taskId) return;

    try {
      const updateData: UpdateTaskDto = {
        title: editData.title,
        description: editData.description,
        status: editData.status,
        priority: editData.priority,
        assignedTo: editData.assignedTo || undefined,
        estimatedHours: editData.estimatedHours
          ? parseInt(editData.estimatedHours)
          : undefined,
        dueDate: editData.dueDate ? new Date(editData.dueDate) : undefined,
      };

      await taskService.updateTask(taskId, updateData);
      await loadTask();
      setEditing(false);
      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to update task',
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!taskId || !projectId) return;

    try {
      await taskService.deleteTask(taskId);
      navigate('/projects/' + projectId + '/tasks');
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to delete task',
        severity: 'error',
      });
    }
  };

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUserOptions([]);
      return;
    }

    setSearchingUsers(true);
    try {
      const users = await userService.searchUsers(query);
      setUserOptions(users);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearchingUsers(false);
    }
  }, []);

  const handleAssignToMe = () => {
    if (currentUser && 'id' in currentUser) {
      setEditData({ ...editData, assignedTo: (currentUser as TaskUser).id });
    }
  };

  const handleNavigateBack = () => {
    navigate('/projects/' + projectId + '/tasks');
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
        <Typography sx={{ color: 'white' }}>Loading...</Typography>
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
        <Typography sx={{ color: 'white' }}>
          Error: {error || 'Task not found'}
        </Typography>
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
      <TaskHeader
        task={task}
        editing={editing}
        editData={editData}
        onNavigateBack={handleNavigateBack}
        onEdit={() => setEditing(true)}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
        onDelete={() => setDeleteConfirmOpen(true)}
        onEditDataChange={setEditData}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <TaskDescription
              task={task}
              editing={editing}
              editData={editData}
              onEditDataChange={setEditData}
            />

            <TaskComments
              taskId={taskId!}
              currentUser={currentUser as TaskUser | null}
              projectMembers={userOptions}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <TaskDetailsSidebar
            task={task}
            editing={editing}
            editData={editData}
            userOptions={userOptions}
            searchingUsers={searchingUsers}
            currentUser={currentUser as TaskUser | null}
            onEditDataChange={setEditData}
            onSearchUsers={searchUsers}
            onAssignToMe={handleAssignToMe}
          />
        </Grid>
      </Grid>

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
