import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types/project';
import { SlideIn } from '../animations/index.js';

interface TeamManageHeaderProps {
  project: Project;
  onAddMember: () => void;
}

export const TeamManageHeader: React.FC<TeamManageHeaderProps> = ({
  project,
  onAddMember,
}) => {
  const navigate = useNavigate();

  return (
    <SlideIn direction="up">
      <Box
        sx={{
          position: 'relative',
          zIndex: 3,
          mb: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
            }}
          >
            <IconButton
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'inline-flex',
              }}
            >
              <Box
                sx={{
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    color: 'white',
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                  }}
                >
                  {project.key}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  mb: 1,
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                }}
              >
                Team Management
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                Manage team members for {project.name}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAddMember}
              sx={{
                borderRadius: 3,
                px: { xs: 2.5, sm: 3 },
                py: { xs: 1.25, sm: 1.5 },
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                Add Member
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>Add</Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </SlideIn>
  );
};
