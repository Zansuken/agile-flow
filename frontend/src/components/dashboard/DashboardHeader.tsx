import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SlideIn } from '../animations/index.js';

interface DashboardHeaderProps {
  userName?: string;
  onRefresh: () => void;
  loading?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  onRefresh,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <SlideIn direction="up">
      <Box mb={6}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 1,
          }}
        >
          Welcome back, {userName || 'User'}!
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 4,
            fontWeight: 400,
          }}
        >
          Here's what's happening with your projects today.
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects')}
            sx={{
              borderRadius: '50px',
              py: 1.5,
              px: 4,
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Create New Project
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              borderRadius: '50px',
              py: 1.5,
              px: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>
    </SlideIn>
  );
};
