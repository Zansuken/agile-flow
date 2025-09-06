import {
  FolderOpen as ProjectIcon,
  Assignment as TaskIcon,
  People as TeamIcon,
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
import { HoverCard, StaggerContainer } from '../animations/index.js';

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
      title: 'Team Members',
      value: stats?.totalMembers?.toString() || '0',
      subtitle: `${stats?.onlineMembers || 0} online now`,
      icon: TeamIcon,
      color: theme.palette.success.main,
      trend: stats?.onlineMembers ? `+${stats.onlineMembers}` : '+0',
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
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mt: 6,
        }}
      >
        {displayStats.map((stat) => (
          <HoverCard key={stat.title}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <stat.icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  />
                </Box>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  gutterBottom
                  sx={{ color: 'white' }}
                >
                  {stat.value}
                </Typography>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: 'white', fontWeight: 600 }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </HoverCard>
        ))}
      </Box>
    </StaggerContainer>
  );
};
