import { Add, ArrowBack } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react';

interface TasksHeaderProps {
  onNavigateBack: () => void;
  onCreateTask: () => void;
}

export const TasksHeader: React.FC<TasksHeaderProps> = ({
  onNavigateBack,
  onCreateTask,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <IconButton onClick={onNavigateBack} sx={{ color: 'white', mr: 2 }}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" sx={{ color: 'white', flexGrow: 1 }}>
        Tasks
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onCreateTask}
        sx={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        Create Task
      </Button>
    </Box>
  );
};
