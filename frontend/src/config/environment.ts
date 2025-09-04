/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

interface EnvironmentConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const getApiUrl = (): string => {
  // Priority order:
  // 1. VITE_API_URL (preferred)
  // 2. VITE_API_BASE_URL (legacy)
  // 3. Environment-based fallback

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Fallback based on environment
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }

  // Production fallback
  return 'https://agile-flow-production.up.railway.app/api';
};

export const config: EnvironmentConfig = {
  apiUrl: getApiUrl(),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Debug logging in development
if (config.isDevelopment) {
  console.log('🔧 Environment Configuration:', {
    apiUrl: config.apiUrl,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    envVars: {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    },
  });
}
