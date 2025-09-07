import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  FolderOpen as ProjectIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { RecentProject } from '../../services/dashboardService';
import { HoverCard, SlideIn, StaggerContainer } from '../animations';
import { TeamAvatars } from '../shared';

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
              <HoverCard key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background:
                        'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
                    }}
                  />

                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Chip
                        label={project.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            project.status === 'Completed'
                              ? 'rgba(76, 175, 80, 0.2)'
                              : 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 600,
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                        }}
                      />
                      <TeamAvatars
                        memberIds={project.memberIds}
                        maxAvatars={3}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{ color: 'white' }}
                    >
                      {project.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {project.description}
                    </Typography>

                    <Box mb={2}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ color: 'white' }}
                        >
                          Progress
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: 'white' }}
                        >
                          {project.progress}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${project.progress}%`,
                            background:
                              'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </HoverCard>
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
