import { ArrowBack, Cancel, Check, Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import React from 'react';
import type { Task } from '../../types/task';
import type { TaskEditData } from './types';

interface TaskHeaderProps {
  task: Task;
  editing: boolean;
  editData: TaskEditData;
  onNavigateBack: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onEditDataChange: (data: TaskEditData) => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  editing,
  editData,
  onNavigateBack,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditDataChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 3,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        p: 2,
      }}
    >
      <IconButton onClick={onNavigateBack} sx={{ color: 'white', mr: 2 }}>
        <ArrowBack />
      </IconButton>
      <Box sx={{ flexGrow: 1 }}>
        {editing ? (
          <TextField
            fullWidth
            value={editData.title}
            onChange={(e) =>
              onEditDataChange({ ...editData, title: e.target.value })
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
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            {task.title}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {editing ? (
          <>
            <IconButton onClick={onSave} sx={{ color: 'white' }}>
              <Check />
            </IconButton>
            <IconButton onClick={onCancel} sx={{ color: 'white' }}>
              <Cancel />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton onClick={onEdit} sx={{ color: 'white' }}>
              <Edit />
            </IconButton>
            <IconButton onClick={onDelete} sx={{ color: 'white' }}>
              <Delete />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};
