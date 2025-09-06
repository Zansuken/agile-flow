import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import {
  DashboardBackground,
  DashboardHeader,
  RecentProjects,
  StatsCards,
} from '../components/dashboard';
import { useAuth } from '../hooks/useAuth.js';
import {
  dashboardService,
  type DashboardStats,
  type RecentProject,
} from '../services/dashboardService.js';

export const DashboardPage: React.FC = () => {
  const { currentUserData, currentUser } = useAuth();

  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      // Load stats and recent projects in parallel
      const [dashboardStats, projects] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentProjects(6),
      ]);

      setStats(dashboardStats);
      setRecentProjects(projects);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <DashboardBackground>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header Section */}
        <DashboardHeader
          userName={currentUserData?.displayName}
          onRefresh={loadDashboardData}
          loading={loading}
        />
        {/* Recent Projects Section */}
        <RecentProjects projects={recentProjects} />

        {/* Stats Cards */}
        <StatsCards stats={stats} />
      </Container>
    </DashboardBackground>
  );
};
