/**
 * Application Constants
 * Centralized configuration for design tokens, animations, and app settings
 */

// Design Tokens
export const DESIGN_TOKENS = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border Radius
  borderRadius: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },

  // Shadows
  shadows: {
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
    glassHover: '0 12px 40px rgba(0, 0, 0, 0.15)',
    elevated: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },

  // Typography
  typography: {
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    fontSize: {
      caption: '0.7rem',
      small: '0.75rem',
      body: '0.875rem',
      h6: '1rem',
      h5: '1.25rem',
      h4: '1.5rem',
      h3: '2rem',
    },
  },
} as const;

// Glass Morphism Theme
export const GLASS_MORPHISM = {
  background: {
    primary: 'rgba(255, 255, 255, 0.15)',
    secondary: 'rgba(255, 255, 255, 0.1)',
    tertiary: 'rgba(255, 255, 255, 0.05)',
  },
  border: {
    primary: '1px solid rgba(255, 255, 255, 0.2)',
    secondary: '1px solid rgba(255, 255, 255, 0.15)',
    tertiary: '1px solid rgba(255, 255, 255, 0.1)',
  },
  backdropFilter: 'blur(15px)',
  text: {
    primary: 'white',
    secondary: 'rgba(255, 255, 255, 0.9)',
    tertiary: 'rgba(255, 255, 255, 0.8)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
} as const;

// Animation Constants
export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    easeInOut: [0.25, 0.46, 0.45, 0.94],
    easeOut: [0.25, 0.46, 0.45, 0.94],
    spring: { type: 'spring', damping: 20, stiffness: 100 },
  },
  stagger: {
    children: 0.1,
    delay: 0.2,
  },
  hover: {
    scale: 1.05,
    translateY: -2,
  },
} as const;

// Background Animations
export const FLOATING_ANIMATIONS = {
  circle: {
    large: {
      width: 250,
      height: 250,
      animation: 'float 6s ease-in-out infinite',
    },
    medium: {
      width: 180,
      height: 180,
      animation: 'floatSlow 8s ease-in-out infinite',
    },
    small: {
      width: 120,
      height: 120,
      animation: 'floatMedium 7s ease-in-out infinite',
    },
  },
  keyframes: `
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(-180deg); }
    }
    @keyframes floatMedium {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-25px) rotate(90deg); }
    }
  `,
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
  PROJECT_TEAM: '/projects/:projectId/team',
  PROJECT_SETTINGS: '/projects/:projectId/settings',
  PROJECT_KANBAN: '/projects/:projectId/kanban',
  PROJECT_SPRINTS: '/projects/:projectId/sprints',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  PROJECTS: '/projects',
  DASHBOARD: '/dashboard',
  TEAM: '/team',
  AUTH: '/auth',
} as const;

// Layout Constants
export const LAYOUT = {
  navbar: {
    height: 64,
  },
  container: {
    maxWidth: '1200px',
    padding: {
      xs: 16,
      sm: 24,
      md: 32,
    },
  },
} as const;

// Status Colors
export const STATUS_COLORS = {
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  primary: '#667eea',
  secondary: '#764ba2',
} as const;

// Breakpoints (for consistency with MUI)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;
