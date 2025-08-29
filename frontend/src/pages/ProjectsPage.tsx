import { Add as AddIcon, FolderOpen as ProjectIcon } from '@mui/icons-material';
import {
  Alert,
  alpha,
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
import { SlideIn, StaggerContainer } from '../components/animations/index.js';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import type { CreateProjectDto, Project } from '../types/project';
import { formatDate, getDateAge } from '../utils/dateUtils';

export const ProjectsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, loginWithGoogle } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadProjects = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

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
  }, [currentUser]);

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
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: { xs: 2, sm: 2.5, md: 3 },
        width: '100%',
        maxWidth: '100vw',
      }}
    >
      {!currentUser ? (
        <SlideIn direction="up">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
            gap={4}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
              }}
            >
              Welcome to AgileFlow
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              maxWidth={400}
            >
              Please sign in to access your projects and start collaborating
              with your team.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={loginWithGoogle}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                  transform: 'translateY(-2px)',
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
            >
              <CircularProgress size={60} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {!loading && (
            <>
              <SlideIn direction="up">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={6}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                      }}
                    >
                      Projects
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Manage and track your team's projects
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                        transform: 'translateY(-2px)',
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
                    gap: 3,
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(350px, 1fr))',
                  }}
                >
                  {projects.map((project) => (
                    <SlideIn key={project.id} direction="up">
                      <Box>
                        <Card
                          sx={{
                            background: alpha(
                              theme.palette.background.paper,
                              0.7,
                            ),
                            backdropFilter: 'blur(20px)',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            boxShadow: theme.shadows[2],
                            overflow: 'hidden',
                            position: 'relative',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
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
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.accent?.main || theme.palette.secondary.main, 0.1)})`,
                                  }}
                                >
                                  <ProjectIcon
                                    sx={{
                                      color: theme.palette.primary.main,
                                      fontSize: 24,
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <Typography variant="h6" fontWeight={600}>
                                    {project.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
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
                                      backgroundColor: alpha(
                                        statusInfo.color,
                                        0.1,
                                      ),
                                      color: statusInfo.color,
                                      border: `1px solid ${alpha(statusInfo.color, 0.3)}`,
                                      fontWeight: 500,
                                    }}
                                  />
                                );
                              })()}
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={3}
                              lineHeight={1.6}
                            >
                              {project.description}
                            </Typography>

                            <Box mb={3}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Created {formatDate(project.createdAt)}
                              </Typography>
                            </Box>

                            <Box display="flex" gap={3} mb={3}>
                              <Box display="flex" alignItems="center" gap={1}>
                                <ProjectIcon
                                  sx={{
                                    fontSize: 18,
                                    color: theme.palette.text.secondary,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
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
                                  borderRadius: 2,
                                  textTransform: 'none',
                                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.accent?.main || theme.palette.secondary.main, 0.8)})`,
                                  '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
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
                >
                  <ProjectIcon
                    sx={{
                      fontSize: 64,
                      color: theme.palette.text.secondary,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    No projects yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Create your first project to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.accent?.main || theme.palette.secondary.main})`,
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
  );
};
