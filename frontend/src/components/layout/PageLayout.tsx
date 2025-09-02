import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
import { contentContainer, pageBackground } from '../../styles/glassStyles';
import { FloatingCircles } from '../common/FloatingCircles';

interface PageLayoutProps {
  children: React.ReactNode;
  hasFloatingCircles?: boolean;
  sx?: SxProps<Theme>;
  containerSx?: SxProps<Theme>;
}

/**
 * PageLayout Component
 * Consistent layout wrapper for all pages with glass-morphism background
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  hasFloatingCircles = true,
  sx,
  containerSx,
}) => {
  const basePageStyle = pageBackground();
  const baseContainerStyle = contentContainer();

  return (
    <Box sx={[basePageStyle, ...(Array.isArray(sx) ? sx : [sx])]}>
      {hasFloatingCircles && <FloatingCircles />}
      <Box
        sx={[
          baseContainerStyle,
          ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
        ]}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
