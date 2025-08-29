import { alpha, createTheme } from '@mui/material/styles';

// Extend Material-UI theme to include custom properties
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}

// Modern color palette - Deep Ocean Blue with complementary colors
const colors = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3', // Main primary
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  secondary: {
    50: '#f3e5f5',
    100: '#e1bee7',
    200: '#ce93d8',
    300: '#ba68c8',
    400: '#ab47bc',
    500: '#9c27b0', // Main secondary
    600: '#8e24aa',
    700: '#7b1fa2',
    800: '#6a1b9a',
    900: '#4a148c',
  },
  accent: {
    50: '#fff3e0',
    100: '#ffe0b2',
    200: '#ffcc80',
    300: '#ffb74d',
    400: '#ffa726',
    500: '#ff9800', // Warm orange accent
    600: '#fb8c00',
    700: '#f57c00',
    800: '#ef6c00',
    900: '#e65100',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  success: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  error: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
};

// Custom animations and transitions
const animations = {
  transitions: {
    standard: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    emphasized: '0.5s cubic-bezier(0.2, 0, 0, 1)',
    bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  keyframes: {
    fadeIn: {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    slideIn: {
      '0%': {
        opacity: 0,
        transform: 'translateX(-30px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    scaleIn: {
      '0%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      '100%': {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    pulse: {
      '0%': {
        transform: 'scale(1)',
      },
      '50%': {
        transform: 'scale(1.05)',
      },
      '100%': {
        transform: 'scale(1)',
      },
    },
  },
};

// Typography system
const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.00938em',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    letterSpacing: '0.01071em',
  },
};

// Responsive breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Shadows with modern approach - exactly 25 elements as required by Material-UI
const shadows: [
  'none',
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] = [
  'none',
  '0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)',
  '0px 1px 5px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04)',
  '0px 1px 8px rgba(0, 0, 0, 0.08), 0px 3px 6px rgba(0, 0, 0, 0.04)',
  '0px 2px 12px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.04)',
  '0px 3px 16px rgba(0, 0, 0, 0.08), 0px 6px 12px rgba(0, 0, 0, 0.04)',
  '0px 4px 20px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.04)',
  '0px 6px 24px rgba(0, 0, 0, 0.08), 0px 12px 20px rgba(0, 0, 0, 0.04)',
  '0px 8px 28px rgba(0, 0, 0, 0.08), 0px 16px 24px rgba(0, 0, 0, 0.04)',
  '0px 12px 32px rgba(0, 0, 0, 0.08), 0px 20px 28px rgba(0, 0, 0, 0.04)',
  '0px 16px 40px rgba(0, 0, 0, 0.12), 0px 24px 32px rgba(0, 0, 0, 0.08)',
  '0px 20px 44px rgba(0, 0, 0, 0.12), 0px 28px 36px rgba(0, 0, 0, 0.08)',
  '0px 24px 48px rgba(0, 0, 0, 0.15), 0px 32px 40px rgba(0, 0, 0, 0.10)',
  '0px 28px 52px rgba(0, 0, 0, 0.15), 0px 36px 44px rgba(0, 0, 0, 0.10)',
  '0px 32px 56px rgba(0, 0, 0, 0.15), 0px 40px 48px rgba(0, 0, 0, 0.10)',
  '0px 36px 60px rgba(0, 0, 0, 0.18), 0px 44px 52px rgba(0, 0, 0, 0.12)',
  '0px 40px 64px rgba(0, 0, 0, 0.18), 0px 48px 56px rgba(0, 0, 0, 0.12)',
  '0px 44px 68px rgba(0, 0, 0, 0.18), 0px 52px 60px rgba(0, 0, 0, 0.12)',
  '0px 48px 72px rgba(0, 0, 0, 0.20), 0px 56px 64px rgba(0, 0, 0, 0.15)',
  '0px 52px 76px rgba(0, 0, 0, 0.20), 0px 60px 68px rgba(0, 0, 0, 0.15)',
  '0px 56px 80px rgba(0, 0, 0, 0.22), 0px 64px 72px rgba(0, 0, 0, 0.18)',
  '0px 60px 84px rgba(0, 0, 0, 0.22), 0px 68px 76px rgba(0, 0, 0, 0.18)',
  '0px 64px 88px rgba(0, 0, 0, 0.24), 0px 72px 80px rgba(0, 0, 0, 0.20)',
  '0px 68px 92px rgba(0, 0, 0, 0.24), 0px 76px 84px rgba(0, 0, 0, 0.20)',
  '0px 72px 96px rgba(0, 0, 0, 0.26), 0px 80px 88px rgba(0, 0, 0, 0.22)',
];

// Create the theme
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: '#ffffff',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
    },
    background: {
      default: '#fafbfc',
      paper: '#ffffff',
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[600],
      disabled: colors.neutral[400],
    },
    grey: colors.neutral,
    // Custom colors
    accent: {
      main: colors.accent[500],
      light: colors.accent[300],
      dark: colors.accent[700],
      contrastText: '#ffffff',
    },
  },
  typography,
  breakpoints,
  shadows,
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: '#fafbfc',
          color: colors.neutral[800],
        },
        '@keyframes fadeIn': animations.keyframes.fadeIn,
        '@keyframes slideIn': animations.keyframes.slideIn,
        '@keyframes scaleIn': animations.keyframes.scaleIn,
        '@keyframes pulse': animations.keyframes.pulse,
        '.animate-fade-in': {
          animation: `fadeIn ${animations.transitions.standard} ease-out`,
        },
        '.animate-slide-in': {
          animation: `slideIn ${animations.transitions.standard} ease-out`,
        },
        '.animate-scale-in': {
          animation: `scaleIn ${animations.transitions.bounce} ease-out`,
        },
        '.animate-pulse': {
          animation: `pulse 2s ${animations.transitions.standard} infinite`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '10px 24px',
          transition: animations.transitions.standard,
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: shadows[2],
          },
        },
        contained: {
          boxShadow: shadows[2],
          '&:hover': {
            boxShadow: shadows[6],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${alpha(colors.neutral[300], 0.5)}`,
          boxShadow: shadows[1],
          transition: animations.transitions.standard,
          '&:hover': {
            boxShadow: shadows[4],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: animations.transitions.standard,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[400],
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: colors.primary[600],
              },
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#ffffff', 0.9),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(colors.neutral[300], 0.2)}`,
          color: colors.neutral[800],
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${alpha(colors.neutral[300], 0.2)}`,
          backgroundColor: alpha('#ffffff', 0.95),
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: shadows[3],
          transition: animations.transitions.bounce,
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: shadows[6],
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

// Export colors and animations for use in custom components
export { animations, colors };

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0e27',
      paper: '#1a1f3a',
    },
    text: {
      primary: alpha('#ffffff', 0.95),
      secondary: alpha('#ffffff', 0.7),
      disabled: alpha('#ffffff', 0.5),
    },
    accent: {
      main: colors.accent[400],
      light: colors.accent[300],
      dark: colors.accent[600],
      contrastText: '#000000',
    },
  },
});

export default theme;
