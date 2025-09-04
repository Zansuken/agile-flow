import type { Theme } from '@mui/material';
import { Box } from '@mui/material';
import type { SxProps } from '@mui/system';
import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'full' | 'icon';
  sx?: SxProps<Theme>;
}

export const Logo: React.FC<LogoProps> = ({
  size = 32,
  variant = 'full',
  sx,
}) => {
  const logoSrc = '/logo.png';
  const aspectRatio = variant === 'icon' ? 1 : 400 / 120; // New logo is 400x120

  return (
    <Box
      component="img"
      src={logoSrc}
      alt="AgileFlow Logo"
      sx={{
        height: size,
        width: variant === 'icon' ? size : size * aspectRatio,
        objectFit: 'contain',
        ...sx,
      }}
    />
  );
};
