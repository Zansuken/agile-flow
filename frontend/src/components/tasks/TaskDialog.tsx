import { Person } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import type {
  Task,
  TaskPriority,
  TaskStatus,
  TaskUser,
} from '../../types/task';

interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
}

interface TaskDialogProps {
  open: boolean;
  editingTask: Task | null;
  formData: TaskFormData;
  userOptions: TaskUser[];
  projectMembers: TaskUser[];
  searchingUsers: boolean;
  onClose: () => void;
  onFormDataChange: (data: Partial<TaskFormData>) => void;
  onSave: () => void;
  onSearchUsers: (query: string) => Promise<void>;
  onUserOptionsChange: (users: TaskUser[]) => void;
}

export const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  editingTask,
  formData,
  userOptions,
  projectMembers,
  searchingUsers,
  onClose,
  onFormDataChange,
  onSave,
  onSearchUsers,
  onUserOptionsChange,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white' }}>
        {editingTask ? 'Edit Task' : 'Create Task'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => onFormDataChange({ title: e.target.value })}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)' },
            }}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => onFormDataChange({ description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)' },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Status
            </InputLabel>
            <Select
              value={formData.status}
              onChange={(e) =>
                onFormDataChange({
                  status: e.target.value as TaskStatus,
                })
              }
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="in_review">In Review</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Priority
            </InputLabel>
            <Select
              value={formData.priority}
              onChange={(e) =>
                onFormDataChange({
                  priority: e.target.value as TaskPriority,
                })
              }
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            options={userOptions}
            getOptionLabel={(option) => option.displayName || option.email}
            value={
              userOptions.find((user) => user.id === formData.assignedTo) ||
              null
            }
            onChange={(_, value) => {
              onFormDataChange({
                assignedTo: value?.id || '',
              });
            }}
            onInputChange={(_, value) => onSearchUsers(value)}
            onOpen={() => {
              // Show all project members when dropdown opens
              if (userOptions.length === 0) {
                onUserOptionsChange(projectMembers);
              }
            }}
            loading={searchingUsers}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assignee"
                placeholder="Search for a user to assign..."
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
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" />
                  <Box>
                    <Typography variant="body2">
                      {option.displayName || 'Unknown User'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
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

          <TextField
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => onFormDataChange({ dueDate: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.8)' },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!formData.title.trim()}
          sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': { background: 'rgba(255, 255, 255, 0.3)' },
          }}
        >
          {editingTask ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
