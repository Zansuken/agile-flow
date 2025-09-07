import {
  FolderOpen as ProjectIcon,
  Assignment as TaskIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';

import type { DashboardStats } from '../../services/dashboardService.js';
import { StaggerContainer } from '../animations/index.js';

interface StatsCardsProps {
  stats: DashboardStats | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const theme = useTheme();

  // Create display stats from real data
  const displayStats = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects?.toString() || '0',
      subtitle: `${stats?.activeProjects || 0} active`,
      icon: ProjectIcon,
      color: theme.palette.primary.main,
      trend: stats?.totalProjects
        ? `${stats.activeProjects}/${stats.totalProjects}`
        : '0/0',
    },
    {
      title: 'Active Tasks',
      value: stats?.activeTasks?.toString() || '0',
      subtitle: `${stats?.completedTasks || 0} completed`,
      icon: TaskIcon,
      color: theme.palette.secondary.main,
      trend: stats?.totalTasks
        ? `${stats.completedTasks}/${stats.totalTasks}`
        : '0/0',
    },
    {
      title: 'Project Progress',
      value: stats?.totalProjects
        ? `${Math.round((stats.activeProjects / stats.totalProjects) * 100)}%`
        : '0%',
      subtitle: `${stats?.totalProjects || 0} total projects`,
      icon: TrendingUpIcon,
      color: theme.palette.warning.main,
      trend: stats?.activeProjects ? `+${stats.activeProjects}` : '+0',
    },
  ];

  return (
    <StaggerContainer>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
          mt: 6,
        }}
      >
        {displayStats.map((stat) => (
          <Box key={stat.title}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'visible',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={1.5}
                >
                  <Box
                    sx={{
                      p: 1.25,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon sx={{ fontSize: { xs: 22, sm: 24 } }} />
                  </Box>
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{
                    color: 'white',
                    fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </StaggerContainer>
  );
};
