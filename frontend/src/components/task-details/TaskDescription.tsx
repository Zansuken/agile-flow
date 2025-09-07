import { Paper, TextField, Typography } from '@mui/material';
import React from 'react';
import type { Task } from '../../types/task';
import type { TaskEditData } from './types';

interface TaskDescriptionProps {
  task: Task;
  editing: boolean;
  editData: TaskEditData;
  onEditDataChange: (data: TaskEditData) => void;
}

export const TaskDescription: React.FC<TaskDescriptionProps> = ({
  task,
  editing,
  editData,
  onEditDataChange,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
        Description
      </Typography>
      {editing ? (
        <TextField
          fullWidth
          multiline
          rows={4}
          value={editData.description}
          onChange={(e) =>
            onEditDataChange({ ...editData, description: e.target.value })
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
    </Paper>
  );
};
