import {
  Edit as EditIcon,
  ViewKanban as TaskIcon,
  Group as TeamIcon,
} from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideIn } from '../animations';

interface ProjectQuickActionsProps {
  projectId: string;
}

export const ProjectQuickActions: React.FC<ProjectQuickActionsProps> = ({
  projectId,
}) => {
  const navigate = useNavigate();

  return (
    <SlideIn direction="up">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          startIcon={<TaskIcon />}
          onClick={() => navigate(`/projects/${projectId}/tasks`)}
          sx={{
            borderRadius: '50px',
            py: 1.5,
            px: 4,
            textTransform: 'none',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.35)',
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          View Tasks
        </Button>

        <Button
          variant="outlined"
          startIcon={<TeamIcon />}
          onClick={() => navigate(`/projects/${projectId}/team`)}
          sx={{
            borderRadius: '50px',
            py: 1.5,
            px: 4,
            textTransform: 'none',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Manage Team
        </Button>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/projects/${projectId}/settings`)}
          sx={{
            borderRadius: '50px',
            py: 1.5,
            px: 4,
            textTransform: 'none',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Edit Project
        </Button>
      </Box>
    </SlideIn>
  );
};
