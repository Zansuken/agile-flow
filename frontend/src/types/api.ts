/**
 * API Response Types
 * Standardized response formats for all API calls
 */

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// API Error Response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// Request Options
export interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

// File Upload Types
export interface FileUpload {
  file: File;
  fieldName: string;
  metadata?: Record<string, unknown>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: string;
  };
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expiresAt: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResponse {
  valid: boolean;
  errors: ValidationError[];
}

// Webhook Types
export interface WebhookPayload<T = unknown> {
  event: string;
  data: T;
  timestamp: string;
  signature: string;
}

// Health Check Types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  version: string;
  uptime: number;
  services: Record<
    string,
    {
      status: 'up' | 'down';
      responseTime?: number;
      lastCheck: string;
    }
  >;
}

// Notification Types
export interface NotificationRequest {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

// Search Types
export interface SearchRequest {
  query: string;
  filters?: Record<string, unknown>;
  facets?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse<T> {
  results: T[];
  total: number;
  facets?: Record<string, Array<{ value: string; count: number }>>;
  suggestions?: string[];
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Audit Log Types
export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<
    string,
    {
      old: unknown;
      new: unknown;
    }
  >;
  ip: string;
  userAgent: string;
  timestamp: string;
}

// Export all types from the main types file
export * from './index';
