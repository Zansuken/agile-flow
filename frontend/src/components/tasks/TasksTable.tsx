import { Assignment, Delete, Edit } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormControl,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUser,
  UpdateTaskDto,
} from '../../types/task';

interface TasksTableProps {
  projectId: string;
  tasks: Task[];
  userOptions: TaskUser[];
  searchingUsers: boolean;
  onInlineUpdate: (
    taskId: string,
    field: keyof UpdateTaskDto,
    value: unknown,
  ) => Promise<void>;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  onSearchUsers: (query: string) => Promise<void>;
}

export const TasksTable: React.FC<TasksTableProps> = ({
  projectId,
  tasks,
  userOptions,
  searchingUsers,
  onInlineUpdate,
  onEditTask,
  onDeleteTask,
  onSearchUsers,
}) => {
  const navigate = useNavigate();
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      urgent: '#9c27b0',
    };
    return colors[priority];
  };

  const getStatusColor = (status: TaskStatus): string => {
    const colors = {
      todo: '#9e9e9e',
      in_progress: '#2196f3',
      in_review: '#ff9800',
      done: '#4caf50',
    };
    return colors[status];
  };

  return (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <TableContainer
            component={Paper}
            sx={{
              background: 'transparent',
              overflowX: 'auto',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <Table sx={{ minWidth: 800, width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 200,
                      width: 200,
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 120,
                      width: 120,
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 100,
                      width: 100,
                    }}
                  >
                    Priority
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 180,
                      width: 180,
                    }}
                  >
                    Assignee
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 140,
                      width: 140,
                    }}
                  >
                    Due Date
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: 120,
                      width: 120,
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(15px)',
                      zIndex: 1,
                      boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell
                      sx={{
                        color: 'white',
                        minWidth: 200,
                        width: 200,
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Tooltip title={task.title} arrow placement="top">
                          <Typography
                            variant="subtitle1"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              width: '100%',
                            }}
                          >
                            {task.title}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        minWidth: 120,
                        width: 120,
                      }}
                    >
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={task.status}
                          onChange={(e) =>
                            onInlineUpdate(
                              task.id,
                              'status',
                              e.target.value as TaskStatus,
                            )
                          }
                          sx={{
                            color: 'white',
                            backgroundColor: getStatusColor(task.status),
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiSelect-icon': {
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
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        minWidth: 100,
                        width: 100,
                      }}
                    >
                      <FormControl size="small" sx={{ minWidth: 80 }}>
                        <Select
                          value={task.priority}
                          onChange={(e) =>
                            onInlineUpdate(
                              task.id,
                              'priority',
                              e.target.value as TaskPriority,
                            )
                          }
                          sx={{
                            color: 'white',
                            backgroundColor: getPriorityColor(task.priority),
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiSelect-icon': {
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
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        minWidth: 180,
                        width: 180,
                      }}
                    >
                      <Autocomplete
                        size="small"
                        options={userOptions}
                        getOptionLabel={(option) =>
                          option.displayName || option.email
                        }
                        value={
                          userOptions.find(
                            (user) => user.id === task.assignedTo,
                          ) || null
                        }
                        onChange={(_, value) => {
                          onInlineUpdate(
                            task.id,
                            'assignedTo',
                            value?.id || '',
                          );
                        }}
                        onInputChange={(_, value) => onSearchUsers(value)}
                        loading={searchingUsers}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Assign to..."
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'rgba(255, 255, 255, 0.7)',
                                },
                              },
                            }}
                          />
                        )}
                        sx={{
                          '& .MuiAutocomplete-popupIndicator': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          '& .MuiAutocomplete-clearIndicator': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        color: 'white',
                        minWidth: 140,
                        width: 140,
                      }}
                    >
                      <Tooltip
                        title={
                          task.dueDate
                            ? formatDate(task.dueDate)
                            : 'No due date'
                        }
                        arrow
                        placement="top"
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%',
                          }}
                        >
                          {task.dueDate
                            ? formatDate(task.dueDate)
                            : 'No due date'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        minWidth: 120,
                        width: 120,
                        position: 'sticky',
                        right: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(15px)',
                        zIndex: 1,
                        boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details" arrow>
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/projects/${projectId}/tasks/${task.id}`,
                              )
                            }
                            sx={{ color: 'white' }}
                            size="small"
                          >
                            <Assignment />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Task" arrow>
                          <IconButton
                            onClick={() => onEditTask(task)}
                            sx={{ color: 'white' }}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Task" arrow>
                          <IconButton
                            onClick={() => onDeleteTask(task.id)}
                            sx={{ color: 'white' }}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
