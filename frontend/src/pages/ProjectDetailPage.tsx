import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Alert, Box, CircularProgress, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ProjectDetailBackground,
  ProjectDetailHeader,
  ProjectQuickActions,
  ProjectStatsCards,
  RecentTasks,
} from '../components/project-detail';
import { useProjectRole } from '../hooks/useProjectRole';
import { projectService } from '../services/projectService';
import type { Project } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentRole: userRole, canManageRoles } = useProjectRole(projectId!);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const projectData = await projectService.getProject(projectId);
      setProject(projectData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const handleGoBack = () => {
    navigate('/projects');
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          px: 2,
          py: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <Box mb={4}>
          <IconButton
            onClick={handleGoBack}
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
        <Alert
          severity="error"
          sx={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {error || 'Project not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <ProjectDetailBackground>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <ProjectDetailHeader
          project={project}
          userRole={userRole || undefined}
          canManageRoles={canManageRoles()}
          onGoBack={handleGoBack}
        />

        {/* Quick Actions */}
        <ProjectQuickActions projectId={projectId!} />

        {/* Stats Cards */}
        <ProjectStatsCards project={project} />

        {/* Recent Tasks Section */}
        <RecentTasks projectId={projectId!} />
      </Box>
    </ProjectDetailBackground>
  );
};
