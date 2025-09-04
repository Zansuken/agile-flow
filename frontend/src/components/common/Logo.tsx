import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

interface LogoProps {
  size?: number | string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, sx = {}, onClick }) => {
  return (
    <Box
      component="div"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        ...sx,
      }}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        width={size}
        height={size}
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: '#667eea', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: '#764ba2', stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <path
          d="M200 20 C 310 20 400 110 400 200 C 400 290 310 380 200 380 L 200 340 C 288 340 360 268 360 200 C 360 132 288 60 200 60 L 200 20 Z"
          fill="url(#logoGradient)"
        />

        {/* Middle ring segment */}
        <path
          d="M200 80 C 266 80 320 134 320 200 C 320 266 266 320 200 320 L 200 280 C 244 280 280 244 280 200 C 280 156 244 120 200 120 L 200 80 Z"
          fill="url(#logoGradient)"
        />

        {/* Inner circle */}
        <circle cx="200" cy="200" r="60" fill="url(#logoGradient)" />

        {/* Top right segment */}
        <path
          d="M 280 120 A 80 80 0 0 1 320 200 L 280 200 A 40 40 0 0 0 280 160 Z"
          fill="url(#logoGradient)"
        />

        {/* Bottom right segment */}
        <path
          d="M 320 200 A 80 80 0 0 1 280 280 L 280 240 A 40 40 0 0 0 320 200 Z"
          fill="url(#logoGradient)"
        />
      </svg>
    </Box>
  );
};

export default Logo;
