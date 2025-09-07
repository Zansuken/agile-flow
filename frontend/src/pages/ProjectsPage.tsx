import { Add as AddIcon, FolderOpen as ProjectIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FloatingCircles,
  SlideIn,
  StaggerContainer,
} from '../components/animations';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useAuth } from '../hooks/useAuth';
import type { RecentProject } from '../services/dashboardService';
import { projectService } from '../services/projectService';
import type { Project } from '../types';
import type { CreateProjectDto } from '../types/project';

export const ProjectsPage: React.FC = () => {
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
    return project.status === 'active'
      ? 'Active'
      : project.status === 'archived'
        ? 'Completed'
        : 'Inactive';
  };

  // Convert Project to RecentProject for ProjectCard compatibility
  const convertToRecentProject = (project: Project): RecentProject => {
    return {
      ...project,
      progress: 0, // We'll calculate this based on tasks later, for now default to 0
      team: project.memberIds.length,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days from now
      status: getProjectStatus(project),
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
    };
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
        <FloatingCircles variant="default" />

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
                      <ProjectCard
                        key={project.id}
                        project={convertToRecentProject(project)}
                      />
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
