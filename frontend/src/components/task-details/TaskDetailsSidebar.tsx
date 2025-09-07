import { PersonAdd } from '@mui/icons-material';
import {
  Autocomplete,
  Avatar,
  Box,
  Chip,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUser,
} from '../../types/task';
import { formatDate, getPriorityColor, getStatusColor } from './taskUtils';
import type { TaskEditData } from './types';

interface TaskDetailsSidebarProps {
  task: Task;
  editing: boolean;
  editData: TaskEditData;
  userOptions: TaskUser[];
  searchingUsers: boolean;
  currentUser: TaskUser | null;
  onEditDataChange: (data: TaskEditData) => void;
  onSearchUsers: (query: string) => void;
  onAssignToMe: () => void;
}

export const TaskDetailsSidebar: React.FC<TaskDetailsSidebarProps> = ({
  task,
  editing,
  editData,
  userOptions,
  searchingUsers,
  currentUser,
  onEditDataChange,
  onSearchUsers,
  onAssignToMe,
}) => {
  return (
    <Stack spacing={3}>
      {/* Task Details Card */}
      <Paper
        sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Task Details
        </Typography>

        <Stack spacing={2}>
          {/* Status */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Status
            </Typography>
            {editing ? (
              <FormControl fullWidth size="small">
                <Select
                  value={editData.status}
                  onChange={(e) =>
                    onEditDataChange({
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
                size="small"
              />
            )}
          </Box>

          {/* Priority */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Priority
            </Typography>
            {editing ? (
              <FormControl fullWidth size="small">
                <Select
                  value={editData.priority}
                  onChange={(e) =>
                    onEditDataChange({
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
                size="small"
              />
            )}
          </Box>

          {/* Assignee */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Assignee
            </Typography>
            {editing ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Autocomplete
                  fullWidth
                  size="small"
                  options={userOptions}
                  getOptionLabel={(option) =>
                    option.displayName || option.email
                  }
                  value={
                    userOptions.find((u) => u.id === editData.assignedTo) ||
                    null
                  }
                  onChange={(_, newValue) =>
                    onEditDataChange({
                      ...editData,
                      assignedTo: newValue?.id || '',
                    })
                  }
                  onInputChange={(_, value) => onSearchUsers(value)}
                  loading={searchingUsers}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box component="li" key={key} {...optionProps}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Avatar
                            src={option.photoURL}
                            sx={{ width: 24, height: 24 }}
                          >
                            {(option.displayName ||
                              option.email ||
                              'U')[0].toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {option.displayName || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" color="textPrimary">
                              {option.email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }}
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
                  <Tooltip title="Assign to me">
                    <IconButton
                      onClick={onAssignToMe}
                      size="small"
                      sx={{ color: 'white' }}
                    >
                      <PersonAdd />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={task.assignedToUser?.photoURL}
                  sx={{ width: 24, height: 24 }}
                >
                  {task.assignedToUser?.displayName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography sx={{ color: 'white' }}>
                    {task.assignedToUser?.displayName || 'Unassigned'}
                  </Typography>
                  {task.assignedToUser?.email && (
                    <Typography variant="caption" color="textPrimary">
                      {task.assignedToUser.email}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Due Date */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Due Date
            </Typography>
            {editing ? (
              <TextField
                fullWidth
                size="small"
                type="date"
                value={editData.dueDate}
                onChange={(e) =>
                  onEditDataChange({ ...editData, dueDate: e.target.value })
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
              <Typography sx={{ color: 'white' }}>
                {task.dueDate
                  ? formatDate(new Date(task.dueDate))
                  : 'No due date set'}
              </Typography>
            )}
          </Box>

          {/* Estimated Hours */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Estimated Hours
            </Typography>
            {editing ? (
              <TextField
                fullWidth
                size="small"
                type="number"
                value={editData.estimatedHours}
                onChange={(e) =>
                  onEditDataChange({
                    ...editData,
                    estimatedHours: e.target.value,
                  })
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
              <Typography sx={{ color: 'white' }}>
                {task.estimatedHours
                  ? `${task.estimatedHours} hours`
                  : 'Not estimated'}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Task Metadata */}
      <Paper
        sx={{
          p: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Metadata
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Created By
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={task.createdByUser?.photoURL}
                sx={{ width: 24, height: 24 }}
              >
                {task.createdByUser?.displayName?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography sx={{ color: 'white' }}>
                  {task.createdByUser?.displayName || 'Unknown'}
                </Typography>
                {task.createdByUser?.email && (
                  <Typography variant="caption" color="textPrimary">
                    {task.createdByUser.email}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Created
            </Typography>
            <Typography sx={{ color: 'white' }}>
              {formatDate(new Date(task.createdAt))}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 0.5 }}
            >
              Last Updated
            </Typography>
            <Typography sx={{ color: 'white' }}>
              {formatDate(new Date(task.updatedAt))}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};
