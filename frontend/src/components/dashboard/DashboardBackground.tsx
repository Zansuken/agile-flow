import { Box } from '@mui/material';
import React from 'react';
import { FloatingCircles } from '../animations';

export const DashboardBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh', // Full viewport height since navbar is now fixed
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Circles */}
      <FloatingCircles variant="dense" />

      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </Box>
  );
};
