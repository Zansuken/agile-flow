import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  FolderOpen as ProjectIcon,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { RecentProject } from '../../services/dashboardService';
import { SlideIn, StaggerContainer } from '../animations';
import { ProjectCard } from './ProjectCard';

interface RecentProjectsProps {
  projects: RecentProject[];
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Section Header */}
      <SlideIn direction="up">
        <Box mt={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Typography variant="h5" fontWeight={600} sx={{ color: 'white' }}>
              Recent Projects
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/projects')}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              View All Projects
            </Button>
          </Box>
        </Box>
      </SlideIn>

      {/* Projects Grid */}
      <StaggerContainer>
        {projects.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Box>
        ) : (
          <Box
            textAlign="center"
            py={8}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <ProjectIcon
              sx={{
                fontSize: 80,
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              No projects yet
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Create your first project to get started with AgileFlow
            </Typography>
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
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                },
              }}
            >
              Create Your First Project
            </Button>
          </Box>
        )}
      </StaggerContainer>
    </>
  );
};
