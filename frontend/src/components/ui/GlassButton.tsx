import { Button, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import React from 'react';
import { glassButton } from '../../styles/glassStyles';

interface GlassButtonProps extends Omit<ButtonProps, 'sx'> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * GlassButton Component
 * Reusable button component with glass-morphism styling
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  loading = false,
  loadingText,
  icon,
  disabled,
  sx,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const buttonStyles = glassButton();

  return (
    <Button
      disabled={isDisabled}
      sx={[buttonStyles, ...(Array.isArray(sx) ? sx : [sx])]}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : icon ? (
          icon
        ) : undefined
      }
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default GlassButton;
