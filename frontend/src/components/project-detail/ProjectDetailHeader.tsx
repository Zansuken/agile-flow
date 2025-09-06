import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  FolderOpen as ProjectIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../types';
import { getDateAge } from '../../utils/dateUtils';
import { SlideIn } from '../animations';

interface ProjectDetailHeaderProps {
  project: Project;
  userRole?: string;
  canManageRoles: boolean;
  onGoBack: () => void;
}

export const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({
  project,
  userRole,
  canManageRoles,
  onGoBack,
}) => {
  const navigate = useNavigate();

  const getProjectStatus = (project: Project) => {
    const daysSinceCreated = getDateAge(project.createdAt);

    if (daysSinceCreated === null) {
      return { status: 'Unknown', color: '#9e9e9e' };
    }

    if (daysSinceCreated < 7) return { status: 'New', color: '#2196f3' };
    if (daysSinceCreated < 30) return { status: 'Active', color: '#4caf50' };
    return { status: 'Established', color: '#ff9800' };
  };

  const statusInfo = getProjectStatus(project);

  return (
    <SlideIn direction="up">
      <Box mb={4} sx={{ position: 'relative', zIndex: 2 }}>
        <Box mb={3}>
          <IconButton
            onClick={onGoBack}
            sx={{
              mt: 2,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
          gap={{ xs: 3, sm: 2 }}
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={{ xs: 2, sm: 3 }}>
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <ProjectIcon
                sx={{
                  color: 'white',
                  fontSize: { xs: 24, sm: 32 },
                }}
              />
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
                {project.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  mb: { xs: 1, sm: 0 },
                }}
              >
                Project Key: {project.key}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 0.5, sm: 1 },
                  mt: { xs: 1, sm: 0.5 },
                }}
              >
                <Chip
                  label={statusInfo.status}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 600,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 2 },
              alignSelf: { xs: 'stretch', sm: 'auto' },
            }}
          >
            {userRole && canManageRoles ? (
              <Button
                variant="contained"
                startIcon={<InfoIcon />}
                onClick={() => navigate(`/projects/${project.id}/settings`)}
                sx={{
                  borderRadius: 3,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 1.25, sm: 1.5 },
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  Settings & Info
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  Settings
                </Box>
              </Button>
            ) : (
              <Tooltip
                title={
                  !userRole
                    ? 'Loading user permissions...'
                    : 'You need role management permissions to access project settings'
                }
              >
                <span>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    disabled
                    sx={{
                      borderRadius: 3,
                      px: { xs: 2.5, sm: 3 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    }}
                  >
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      Settings & Info
                    </Box>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                      Settings
                    </Box>
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.7,
            mb: 4,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            maxWidth: '100%',
            wordBreak: 'break-word',
          }}
        >
          {project.description}
        </Typography>
      </Box>
    </SlideIn>
  );
};
