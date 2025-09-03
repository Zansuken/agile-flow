import { Add as AddIcon, FolderOpen as ProjectIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlideIn, StaggerContainer } from '../components/animations';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import type { Project } from '../types';
import type { CreateProjectDto } from '../types/project';
import { formatDate } from '../utils';
import { getDateAge } from '../utils/dateUtils';

export const ProjectsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, loginWithGoogle } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const projectData = await projectService.getProjects();
      setProjects(projectData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []); // Remove currentUser dependency as it's handled by auth service

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async (projectData: CreateProjectDto) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects((prev) => [newProject, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to create project',
      );
    }
  };

  const getProjectStatus = (project: Project) => {
    const daysSinceCreated = getDateAge(project.createdAt);

    if (daysSinceCreated === null) {
      return { status: 'Unknown', color: theme.palette.text.secondary };
    }

    if (daysSinceCreated < 7)
      return { status: 'New', color: theme.palette.info.main };
    if (daysSinceCreated < 30)
      return { status: 'Active', color: theme.palette.success.main };
    return { status: 'Established', color: theme.palette.warning.main };
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-180deg); }
          }
          @keyframes floatMedium {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-25px) rotate(90deg); }
          }
        `}
      </style>
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          px: 2,
          py: { xs: 2, sm: 2.5, md: 3 },
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        {/* Background Circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-3%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            animation: 'floatSlow 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '85%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            animation: 'floatMedium 7s ease-in-out infinite',
          }}
        />
        {!currentUser ? (
          <SlideIn direction="up">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="60vh"
              gap={4}
              sx={{ position: 'relative', zIndex: 2 }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                Welcome to AgileFlow
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  maxWidth: 400,
                }}
              >
                Please sign in to access your projects and start collaborating
                with your team.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={loginWithGoogle}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
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
                Sign in with Google
              </Button>
            </Box>
          </SlideIn>
        ) : (
          <>
            {loading && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
                sx={{ position: 'relative', zIndex: 2 }}
              >
                <CircularProgress size={60} sx={{ color: 'white' }} />
              </Box>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 4,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  position: 'relative',
                  zIndex: 2,
                  '& .MuiAlert-icon': {
                    color: 'white',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {!loading && (
              <>
                <SlideIn direction="up">
                  <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    gap={{ xs: 3, sm: 2 }}
                    mb={{ xs: 4, sm: 5, md: 6 }}
                    sx={{ position: 'relative', zIndex: 2 }}
                  >
                    <Box>
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          color: 'white',
                          mb: 1,
                          fontSize: {
                            xs: '1.75rem',
                            sm: '2.25rem',
                            md: '3rem',
                          },
                        }}
                      >
                        Projects
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                        }}
                      >
                        Manage and track your team's projects
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setIsCreateModalOpen(true)}
                      sx={{
                        borderRadius: '50px',
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.25, sm: 1.5 },
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        alignSelf: { xs: 'flex-start', sm: 'auto' },
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.25)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      New Project
                    </Button>
                  </Box>
                </SlideIn>

                <StaggerContainer>
                  <Box
                    sx={{
                      display: 'grid',
                      gap: { xs: 2, sm: 2.5, md: 3 },
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(auto-fill, minmax(300px, 1fr))',
                        md: 'repeat(auto-fill, minmax(350px, 1fr))',
                      },
                    }}
                  >
                    {projects.map((project) => (
                      <SlideIn key={project.id} direction="up">
                        <Box>
                          <Card
                            sx={{
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(15px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: 3,
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                              overflow: 'hidden',
                              position: 'relative',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.2)',
                                transform: 'translateY(-5px)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                              },
                              transition: 'all 0.3s ease',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 4,
                                background:
                                  'linear-gradient(90deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3))',
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={2}
                              >
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 2,
                                      background: 'rgba(255, 255, 255, 0.2)',
                                    }}
                                  >
                                    <ProjectIcon
                                      sx={{
                                        color: 'white',
                                        fontSize: 24,
                                      }}
                                    />
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      fontWeight={600}
                                      sx={{ color: 'white' }}
                                    >
                                      {project.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                    >
                                      {project.key}
                                    </Typography>
                                  </Box>
                                </Box>
                                {(() => {
                                  const statusInfo = getProjectStatus(project);
                                  return (
                                    <Chip
                                      label={statusInfo.status}
                                      size="small"
                                      sx={{
                                        backgroundColor:
                                          'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        border:
                                          '1px solid rgba(255, 255, 255, 0.3)',
                                        fontWeight: 600,
                                      }}
                                    />
                                  );
                                })()}
                              </Box>

                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  mb: 3,
                                  lineHeight: 1.6,
                                }}
                              >
                                {project.description}
                              </Typography>

                              <Box mb={3}>
                                <Typography
                                  variant="caption"
                                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                >
                                  Created {formatDate(project.createdAt)}
                                </Typography>
                              </Box>

                              <Box display="flex" gap={3} mb={3}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <ProjectIcon
                                    sx={{
                                      fontSize: 18,
                                      color: 'rgba(255, 255, 255, 0.7)',
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                  >
                                    Project Key: {project.key}
                                  </Typography>
                                </Box>
                              </Box>

                              <Box display="flex" justifyContent="flex-end">
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => {
                                    navigate(`/projects/${project.id}`);
                                  }}
                                  sx={{
                                    borderRadius: '25px',
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border:
                                      '1px solid rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    fontWeight: 600,
                                    '&:hover': {
                                      background: 'rgba(255, 255, 255, 0.25)',
                                    },
                                  }}
                                >
                                  Open
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </Box>
                      </SlideIn>
                    ))}
                  </Box>
                </StaggerContainer>

                {/* Empty State */}
                {projects.length === 0 && (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={8}
                    textAlign="center"
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <ProjectIcon
                      sx={{
                        fontSize: 64,
                        color: 'rgba(255, 255, 255, 0.6)',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                      No projects yet
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}
                    >
                      Create your first project to get started
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setIsCreateModalOpen(true)}
                      sx={{
                        borderRadius: '50px',
                        px: 4,
                        py: 1.5,
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
                      Create Project
                    </Button>
                  </Box>
                )}
              </>
            )}
          </>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      </Box>
    </>
  );
};
