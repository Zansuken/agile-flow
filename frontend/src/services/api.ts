import { auth } from '../config/firebase';

export const isDEV = import.meta.env.MODE === 'development';

const API_BASE_URL = isDEV
  ? import.meta.env.VITE_API_URL_DEV
  : import.meta.env.VITE_API_URL;

class ApiService {
  private async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    try {
      const token = await user.getIdToken(/* forceRefresh */ false);
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    } catch (error) {
      console.error('Failed to get ID token:', error);
      throw new Error('Failed to get authentication token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const maxRetries = 3;
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const headers = await this.getAuthHeaders();

        // Add timeout and retry logic
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...headers,
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(
            errorData.message ||
              `HTTP ${response.status}: ${response.statusText}`,
          );

          // Retry on server errors or network issues
          if (response.status >= 500 || response.status === 0) {
            if (attempt < maxRetries) {
              console.warn(
                `API request failed, retrying... (${attempt}/${maxRetries})`,
                {
                  endpoint,
                  status: response.status,
                  attempt,
                },
              );
              await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
              continue;
            }
          }

          throw error;
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        // If it's a network error or timeout, retry
        if (
          ((error instanceof Error && error.name === 'AbortError') ||
            (error instanceof Error && error.message.includes('fetch')) ||
            (error instanceof Error && error.message.includes('network'))) &&
          attempt < maxRetries
        ) {
          console.warn(
            `API request failed, retrying... (${attempt}/${maxRetries})`,
            {
              endpoint,
              error: lastError.message,
              attempt,
            },
          );
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }

        // On the last attempt or non-retryable error, throw
        if (attempt === maxRetries) {
          console.error(
            `API request failed after ${maxRetries} attempts: ${endpoint}`,
            lastError,
          );
          throw lastError;
        }
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | string[]>,
  ): Promise<T> {
    let url = endpoint;
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      });
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();
