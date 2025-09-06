import {
  CalendarToday as CalendarIcon,
  FolderOpen as ProjectIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Box, Card, Typography, useTheme } from '@mui/material';
import React from 'react';
import type { Project } from '../../types';
import { formatDate } from '../../utils';
import { getDateAge } from '../../utils/dateUtils';
import { HoverCard, SlideIn, StaggerContainer } from '../animations';

interface ProjectStatsCardsProps {
  project: Project;
}

export const ProjectStatsCards: React.FC<ProjectStatsCardsProps> = ({
  project,
}) => {
  const theme = useTheme();

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

  const statusInfo = getProjectStatus(project);

  const stats = [
    {
      title: 'Project Key',
      value: project.key,
      icon: ProjectIcon,
      color: theme.palette.primary.main,
    },
    {
      title: 'Created',
      value: formatDate(project.createdAt),
      icon: CalendarIcon,
      color: theme.palette.info.main,
    },
    {
      title: 'Status',
      value: statusInfo.status,
      icon: TrendingUpIcon,
      color: statusInfo.color,
    },
  ];

  return (
    <StaggerContainer>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 2.5 },
          mb: 4,
        }}
      >
        {stats.map((stat, index) => (
          <SlideIn key={index} direction="up">
            <HoverCard>
              <Card
                sx={{
                  borderRadius: 2.5,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  p: 2.5,
                  textAlign: 'center',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'inline-flex',
                    mb: 1.5,
                  }}
                >
                  <stat.icon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  mb={0.5}
                  sx={{
                    color: 'white',
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {stat.title}
                </Typography>
              </Card>
            </HoverCard>
          </SlideIn>
        ))}
      </Box>
    </StaggerContainer>
  );
};
