import { Alert, Box, Snackbar, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TaskDialog,
  TasksHeader,
  TasksStatsCards,
  TasksTable,
} from '../components/tasks';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import type {
  CreateTaskDto,
  Task,
  TaskPriority,
  TaskStats,
  TaskStatus,
  TaskUser,
  UpdateTaskDto,
} from '../types/task';

export const TasksPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignedTo: '',
    dueDate: '',
  });

  // Inline editing state
  const [userOptions, setUserOptions] = useState<TaskUser[]>([]);
  const [projectMembers, setProjectMembers] = useState<TaskUser[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      const tasksData = await taskService.getProjectTasks(projectId);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const loadStats = useCallback(async () => {
    if (!projectId) return;

    try {
      const statsData = await taskService.getProjectTaskStats(projectId);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, [projectId]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || '',
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    });
    // Ensure project members are shown in the assignee field
    setUserOptions(projectMembers);
    setOpenDialog(true);
  };

  const handleSaveTask = async () => {
    if (!projectId) return;

    try {
      if (editingTask) {
        // Update existing task
        const updateData: UpdateTaskDto = {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assignedTo: formData.assignedTo || undefined,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        };

        await taskService.updateTask(editingTask.id, updateData);
        setSnackbar({
          open: true,
          message: 'Task updated successfully',
          severity: 'success',
        });
      } else {
        // Create new task
        const createData: CreateTaskDto = {
          title: formData.title,
          description: formData.description,
          projectId,
          status: formData.status,
          priority: formData.priority,
          assignedTo: formData.assignedTo || undefined,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        };

        await taskService.createTask(createData);
        setSnackbar({
          open: true,
          message: 'Task created successfully',
          severity: 'success',
        });
      }

      setOpenDialog(false);
      // Reload data
      await loadTasks();
      await loadStats();
    } catch (error) {
      console.error('Error saving task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save task',
        severity: 'error',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      setSnackbar({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success',
      });
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error deleting task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete task',
        severity: 'error',
      });
    }
  };

  // Inline editing functions
  const handleInlineUpdate = async (
    taskId: string,
    field: keyof UpdateTaskDto,
    value: unknown,
  ) => {
    try {
      const updateData: UpdateTaskDto = { [field]: value };
      await taskService.updateTask(taskId, updateData);

      // Update local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                [field]: value,
                ...(field === 'assignedTo' && value
                  ? { assignedToUser: userOptions.find((u) => u.id === value) }
                  : {}),
                ...(field === 'assignedTo' && !value
                  ? { assignedToUser: undefined }
                  : {}),
              }
            : task,
        ),
      );

      setSnackbar({
        open: true,
        message: 'Task updated successfully',
        severity: 'success',
      });
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Error updating task:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update task',
        severity: 'error',
      });
    }
  };

  const loadProjectMembers = useCallback(async () => {
    if (!projectId) return;

    try {
      // Load actual project members
      const members = await projectService.getProjectMembers(projectId);
      // Convert User[] to TaskUser[] format
      const taskUsers: TaskUser[] = members.map((user) => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName || user.email,
      }));
      setProjectMembers(taskUsers);
      setUserOptions(taskUsers); // Show project members by default
    } catch (error) {
      console.error('Error loading project members:', error);
      // Fallback to empty array if project members can't be loaded
      setProjectMembers([]);
      setUserOptions([]);
    }
  }, [projectId]);

  const searchUsers = async (query: string) => {
    if (!query || query.length === 0) {
      // Show all project members when no search query
      setUserOptions(projectMembers);
      return;
    }

    if (query.length < 2) {
      setUserOptions([]);
      return;
    }

    setSearchingUsers(true);
    try {
      // Filter project members based on search query
      const filteredMembers = projectMembers.filter(
        (member) =>
          member.displayName.toLowerCase().includes(query.toLowerCase()) ||
          member.email.toLowerCase().includes(query.toLowerCase()),
      );
      setUserOptions(filteredMembers);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchingUsers(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
    });
    // Ensure project members are shown in the assignee field
    setUserOptions(projectMembers);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
  };

  // Load data when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      loadTasks();
      loadStats();
      loadProjectMembers();
    }
  }, [projectId, loadTasks, loadStats, loadProjectMembers]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>Loading tasks...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <TasksHeader
        onNavigateBack={() => navigate(`/projects/${projectId}`)}
        onCreateTask={handleCreateTask}
      />

      {stats && <TasksStatsCards stats={stats} />}

      <TasksTable
        projectId={projectId!}
        tasks={tasks}
        userOptions={userOptions}
        searchingUsers={searchingUsers}
        onInlineUpdate={handleInlineUpdate}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onSearchUsers={searchUsers}
      />

      <TaskDialog
        open={openDialog}
        editingTask={editingTask}
        formData={formData}
        userOptions={userOptions}
        projectMembers={projectMembers}
        searchingUsers={searchingUsers}
        onClose={handleCloseDialog}
        onFormDataChange={(data) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onSave={handleSaveTask}
        onSearchUsers={searchUsers}
        onUserOptionsChange={setUserOptions}
      />

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
