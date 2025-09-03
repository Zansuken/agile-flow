import { Assignment, Person, Schedule, TrendingUp } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import type { TaskStats } from '../../types/task';

interface TasksStatsProps {
  stats: TaskStats | null;
}

export const TasksStatsCards: React.FC<TasksStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 2,
        mb: 3,
      }}
    >
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Assignment sx={{ mr: 2, color: '#4fc3f7' }} />
            <Box>
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2">Total Tasks</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <TrendingUp sx={{ mr: 2, color: '#81c784' }} />
            <Box>
              <Typography variant="h6">{stats.byStatus.in_progress}</Typography>
              <Typography variant="body2">In Progress</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Schedule sx={{ mr: 2, color: '#ffb74d' }} />
            <Box>
              <Typography variant="h6">{stats.byStatus.done}</Typography>
              <Typography variant="body2">Completed</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <Person sx={{ mr: 2, color: '#f06292' }} />
            <Box>
              <Typography variant="h6">{stats.byPriority.urgent}</Typography>
              <Typography variant="body2">Urgent</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
