import type { SxProps, Theme } from '@mui/material/styles';
import { DESIGN_TOKENS, GLASS_MORPHISM } from '../constants';

/**
 * Glass Morphism Style Utilities
 * Reusable style functions for consistent glass-morphism effects
 */

// Base glass morphism effect
export const glassBase = (): SxProps<Theme> => ({
  background: GLASS_MORPHISM.background.primary,
  backdropFilter: GLASS_MORPHISM.backdropFilter,
  border: GLASS_MORPHISM.border.primary,
  boxShadow: DESIGN_TOKENS.shadows.glass,
});

// Glass card with hover effects
export const glassCard = (
  borderRadius: keyof typeof DESIGN_TOKENS.borderRadius = 'medium',
): SxProps<Theme> => ({
  ...glassBase(),
  borderRadius: DESIGN_TOKENS.borderRadius[borderRadius],
  transition: 'all 0.3s ease',
  '&:hover': {
    background: GLASS_MORPHISM.background.secondary,
    transform: `translateY(-${DESIGN_TOKENS.spacing.xs}px)`,
    boxShadow: DESIGN_TOKENS.shadows.glassHover,
  },
});

// Glass button styles
export const glassButton = (): SxProps<Theme> => ({
  ...glassBase(),
  color: GLASS_MORPHISM.text.primary,
  borderRadius: DESIGN_TOKENS.borderRadius.small,
  '&:hover': {
    background: GLASS_MORPHISM.background.secondary,
  },
  '&:disabled': {
    color: GLASS_MORPHISM.text.disabled,
    background: GLASS_MORPHISM.background.tertiary,
    borderColor: GLASS_MORPHISM.border.tertiary,
  },
});

// Glass input/form field styles
export const glassInput = (): SxProps<Theme> => ({
  '& .MuiOutlinedInput-root': {
    background: GLASS_MORPHISM.background.secondary,
    color: GLASS_MORPHISM.text.primary,
    '& fieldset': {
      borderColor: GLASS_MORPHISM.border.secondary,
    },
    '&:hover fieldset': {
      borderColor: GLASS_MORPHISM.border.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: GLASS_MORPHISM.text.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: GLASS_MORPHISM.text.tertiary,
    '&.Mui-focused': {
      color: GLASS_MORPHISM.text.primary,
    },
  },
});

// Glass alert styles
export const glassAlert = (): SxProps<Theme> => ({
  ...glassBase(),
  color: GLASS_MORPHISM.text.primary,
  '& .MuiAlert-icon': {
    color: GLASS_MORPHISM.text.primary,
  },
});

// Page background with gradient
export const pageBackground = (): SxProps<Theme> => ({
  minHeight: 'calc(100vh - 64px)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  overflow: 'hidden',
});

// Content container with proper z-index
export const contentContainer = (): SxProps<Theme> => ({
  position: 'relative',
  zIndex: 2,
  px: { xs: 1, sm: 2, md: 3 },
  py: { xs: 2, sm: 3, md: 4 },
  width: '100%',
  maxWidth: '100vw',
});

// Typography styles for glass theme
export const glassTypography = {
  primary: {
    color: GLASS_MORPHISM.text.primary,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
  },
  secondary: {
    color: GLASS_MORPHISM.text.secondary,
  },
  tertiary: {
    color: GLASS_MORPHISM.text.tertiary,
  },
  heading: {
    color: GLASS_MORPHISM.text.primary,
    fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
    mb: 1,
  },
} as const;

// Glass table styles
export const glassTable = (): SxProps<Theme> => ({
  background: GLASS_MORPHISM.background.secondary,
  backdropFilter: 'blur(10px)',
  border: GLASS_MORPHISM.border.secondary,
  borderRadius: DESIGN_TOKENS.borderRadius.small,
  '& .MuiTableCell-root': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: GLASS_MORPHISM.text.primary,
  },
  '& .MuiTableHead .MuiTableCell-root': {
    fontWeight: DESIGN_TOKENS.typography.fontWeight.semiBold,
  },
});

// Glass chip styles
export const glassChip = (): SxProps<Theme> => ({
  background: GLASS_MORPHISM.background.secondary,
  color: GLASS_MORPHISM.text.primary,
  border: GLASS_MORPHISM.border.secondary,
});
