import { Person as PersonIcon } from '@mui/icons-material';
import { Box, Card, Container, Typography } from '@mui/material';
import React from 'react';

import { ProfileForm } from '../components/profile';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';

export const ProfilePage: React.FC = () => {
  const { currentUserData } = useAuth();

  // Set the page title based on current route
  usePageTitle();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PersonIcon sx={{ fontSize: 32, color: 'white' }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Profile Settings
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
          }}
        >
          Manage your profile information and preferences
        </Typography>
      </Box>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {currentUserData ? (
          <ProfileForm userData={currentUserData} />
        ) : (
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}
          >
            Loading profile data...
          </Typography>
        )}
      </Card>
    </Container>
  );
};
