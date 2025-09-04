import { auth } from '../config/firebase';
import type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  RequestOptions,
} from '../types/api';
import { createErrorMessage } from '../utils';

const getBaseURL = (): string => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api';
  }

  return import.meta.env.VITE_API_URL;
};

/**
 * Base API Service Class
 * Provides common HTTP methods with standardized error handling and type safety
 */
export class BaseApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private requestCache: Map<string, Promise<unknown>> = new Map();

  constructor(baseURL: string = getBaseURL()) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generate cache key for request deduplication
   */
  private getCacheKey(method: string, url: string, data?: unknown): string {
    const dataStr = data ? JSON.stringify(data) : '';
    return `${method}:${url}:${dataStr}`;
  }

  /**
   * Clear request cache (useful for invalidating cached requests)
   */
  protected clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Clear specific request from cache
   */
  protected clearCacheForUrl(url: string): void {
    const keysToDelete = Array.from(this.requestCache.keys()).filter((key) =>
      key.includes(url),
    );
    keysToDelete.forEach((key) => this.requestCache.delete(key));
  }

  /**
   * Get authentication headers with Firebase token
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    const token = await user.getIdToken();

    return {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Set authentication token (deprecated - now uses Firebase auth automatically)
   * @deprecated Use Firebase authentication instead
   */
  setAuthToken(token: string): void {
    console.warn('setAuthToken is deprecated - using Firebase authentication');
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authentication token (deprecated - now uses Firebase auth automatically)
   * @deprecated Use Firebase authentication instead
   */
  removeAuthToken(): void {
    console.warn(
      'removeAuthToken is deprecated - using Firebase authentication',
    );
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: QueryParams): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Make HTTP request with deduplication for GET requests
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options: RequestOptions & {
      data?: unknown;
      params?: QueryParams;
    } = {},
  ): Promise<T> {
    const { data, params, timeout = 10000, headers = {}, signal } = options;

    const url = this.buildURL(endpoint, params);

    // For GET requests, check if we already have a pending request
    if (method === 'GET') {
      const cacheKey = this.getCacheKey(method, url, data);
      const existingRequest = this.requestCache.get(cacheKey);

      if (existingRequest) {
        console.debug(`🔄 Deduplicating request: ${method} ${url}`);
        return existingRequest as Promise<T>;
      }

      // Create and cache the request promise
      const requestPromise = this.executeRequest<T>(
        url,
        method,
        data,
        timeout,
        headers,
        signal,
      );
      this.requestCache.set(cacheKey, requestPromise);

      // Clean up cache after request completes (success or failure)
      requestPromise.finally(() => {
        this.requestCache.delete(cacheKey);
      });

      return requestPromise;
    }

    // For non-GET requests, clear cache for this URL and execute directly
    this.clearCacheForUrl(url);
    return this.executeRequest<T>(url, method, data, timeout, headers, signal);
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest<T>(
    url: string,
    method: string,
    data: unknown,
    timeout: number,
    headers: Record<string, string>,
    signal: AbortSignal | undefined,
  ): Promise<T> {
    // Get Firebase authentication headers
    const authHeaders = await this.getAuthHeaders();
    const requestHeaders = { ...authHeaders, ...headers };

    const config: RequestInit = {
      method,
      headers: requestHeaders,
      signal,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (!signal) {
      config.signal = controller.signal;
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          code: 'UNKNOWN_ERROR',
          message: response.statusText,
          timestamp: new Date().toISOString(),
        }));

        throw new ApiServiceError(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData,
        );
      }

      const responseData = await response.json();

      // Handle both wrapped and direct responses
      // If response has success/data structure, use it as ApiResponse
      if (
        responseData &&
        typeof responseData === 'object' &&
        'success' in responseData
      ) {
        const result: ApiResponse<T> = responseData;
        if (!result.success) {
          throw new ApiServiceError(
            result.error || result.message || 'API request failed',
            response.status,
          );
        }
        return result.data as T;
      } else {
        // Handle direct response (backend returns data directly)
        return responseData as T;
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiServiceError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiServiceError('Request timeout', 408);
        }

        throw new ApiServiceError(
          createErrorMessage('make API request', error),
          0,
        );
      }

      throw new ApiServiceError('Unknown error occurred', 0);
    }
  }

  /**
   * GET request
   */
  protected async get<T>(
    endpoint: string,
    params?: QueryParams,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('GET', endpoint, { ...options, params });
  }

  /**
   * POST request
   */
  protected async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, data });
  }

  /**
   * PUT request
   */
  protected async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, data });
  }

  /**
   * PATCH request
   */
  protected async patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('PATCH', endpoint, { ...options, data });
  }

  /**
   * DELETE request
   */
  protected async delete<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }

  /**
   * GET paginated results
   */
  protected async getPaginated<T>(
    endpoint: string,
    params: QueryParams = {},
    options: RequestOptions = {},
  ): Promise<PaginatedResponse<T>> {
    return this.request<PaginatedResponse<T>>('GET', endpoint, {
      ...options,
      params,
    });
  }

  /**
   * Upload file
   */
  protected async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    options: RequestOptions = {},
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const { headers = {}, ...restOptions } = options;
    const requestHeaders = { ...this.defaultHeaders, ...headers };
    delete requestHeaders['Content-Type']; // Let browser set it for FormData

    return this.request<T>('POST', endpoint, {
      ...restOptions,
      data: formData,
      headers: requestHeaders,
    });
  }
}

/**
 * Custom API Service Error
 */
export class ApiServiceError extends Error {
  public readonly status: number;
  public readonly apiError?: ApiError;

  constructor(message: string, status: number, apiError?: ApiError) {
    super(message);
    this.name = 'ApiServiceError';
    this.status = status;
    this.apiError = apiError;
  }

  public isNetworkError(): boolean {
    return this.status === 0;
  }

  public isTimeoutError(): boolean {
    return this.status === 408;
  }

  public isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  public isServerError(): boolean {
    return this.status >= 500;
  }

  public isUnauthorized(): boolean {
    return this.status === 401;
  }

  public isForbidden(): boolean {
    return this.status === 403;
  }

  public isNotFound(): boolean {
    return this.status === 404;
  }
}

export default BaseApiService;
