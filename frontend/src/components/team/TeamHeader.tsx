import { ArrowBack, Settings } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react';

interface TeamHeaderProps {
  projectName: string;
  onNavigateBack: () => void;
  onOpenSettings: () => void;
  canManageProject: boolean;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  projectName,
  onNavigateBack,
  onOpenSettings,
  canManageProject,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 4,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={onNavigateBack}
          sx={{
            color: 'white',
            mr: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            '&:hover': { background: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 600 }}>
            Team Management
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            {projectName}
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<Settings />}
        onClick={onOpenSettings}
        disabled={!canManageProject}
        sx={{
          background: canManageProject
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: canManageProject ? 'white' : 'rgba(255, 255, 255, 0.5)',
          '&:hover': {
            background: canManageProject
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
          },
          '&:disabled': {
            color: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        Project Settings
      </Button>
    </Box>
  );
};
