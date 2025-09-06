import { Group as GroupIcon, Person as PersonIcon } from '@mui/icons-material';
import { Box, Card, Typography } from '@mui/material';
import React from 'react';
import type { User } from '../../types';
import { HoverCard, SlideIn, StaggerContainer } from '../animations/index.js';

interface TeamStatsCardsProps {
  members: User[];
}

export const TeamStatsCards: React.FC<TeamStatsCardsProps> = ({ members }) => {
  const totalMembers = members?.length || 0;
  const developers = members.filter((m) => m.role === 'developer').length;

  return (
    <StaggerContainer>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <SlideIn direction="left">
          <HoverCard>
            <Card
              sx={{
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 2,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'inline-flex',
                  mb: 1.5,
                }}
              >
                <GroupIcon
                  sx={{
                    color: 'white',
                    fontSize: { xs: 20, sm: 24 },
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight={700}
                mb={0.5}
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                }}
              >
                {totalMembers}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                }}
              >
                Total Members
              </Typography>
            </Card>
          </HoverCard>
        </SlideIn>

        <SlideIn direction="right">
          <HoverCard>
            <Card
              sx={{
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 2,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'inline-flex',
                  mb: 1.5,
                }}
              >
                <PersonIcon
                  sx={{
                    color: 'white',
                    fontSize: { xs: 20, sm: 24 },
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight={700}
                mb={0.5}
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                }}
              >
                {developers}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                }}
              >
                Developers
              </Typography>
            </Card>
          </HoverCard>
        </SlideIn>
      </Box>
    </StaggerContainer>
  );
};
