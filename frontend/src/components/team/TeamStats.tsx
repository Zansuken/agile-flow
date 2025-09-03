import { Group, Person } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import { SlideIn, StaggerContainer } from '../animations';

interface TeamStatsProps {
  totalMembers: number;
  adminCount: number;
  memberCount: number;
}

export const TeamStats: React.FC<TeamStatsProps> = ({
  totalMembers,
  adminCount,
  memberCount,
}) => {
  return (
    <StaggerContainer>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 3,
          mb: 4,
        }}
      >
        <SlideIn direction="up">
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #4fc3f7, #29b6f6)',
              },
            }}
          >
            <CardContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Group sx={{ color: '#4fc3f7', mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ color: 'white', fontWeight: 700 }}
                  >
                    {totalMembers}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Total Members
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>

        <SlideIn direction="up">
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #81c784, #66bb6a)',
              },
            }}
          >
            <CardContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ color: '#81c784', mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ color: 'white', fontWeight: 700 }}
                  >
                    {adminCount}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Administrators
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>

        <SlideIn direction="up">
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #ffb74d, #ffa726)',
              },
            }}
          >
            <CardContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ color: '#ffb74d', mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ color: 'white', fontWeight: 700 }}
                  >
                    {memberCount}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    Members
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </SlideIn>
      </Box>
    </StaggerContainer>
  );
};
