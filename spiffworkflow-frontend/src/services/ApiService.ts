import { BACKEND_BASE_URL } from '../config';
import { objectIsEmpty } from '../helpers';
import UserService from './UserService';
import { UnauthenticatedError, UnexpectedResponseError } from './HttpService';

export type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  queryParams?: Record<string, string | number | boolean | undefined>;
  requireAuth?: boolean;
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
};

const defaultOptions: ApiOptions = {
  method: 'GET',
  headers: {},
  requireAuth: true,
  cache: 'default',
};

/**
 * Creates a complete URL with query parameters
 */
const createUrl = (path: string, queryParams?: Record<string, string | number | boolean | undefined>): string => {
  const updatedPath = path.replace(/^\/v1\.0/, '');
  const url = new URL(`${BACKEND_BASE_URL}${updatedPath}`);
  
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
};

/**
 * Prepares request options including headers, body, etc.
 */
const prepareOptions = (options: ApiOptions): RequestInit => {
  const { method, headers = {}, body, requireAuth = true, cache } = { ...defaultOptions, ...options };
  
  const requestHeaders: Record<string, string> = { ...headers };
  
  // Add auth headers if required
  if (requireAuth && UserService.isLoggedIn()) {
    requestHeaders.Authorization = `Bearer ${UserService.getAccessToken()}`;
    requestHeaders['SpiffWorkflow-Authentication-Identifier'] = 
      UserService.getAuthenticationIdentifier() || 'default';
  }
  
  // Process body data
  let processedBody: any = undefined;
  
  if (body) {
    if (body instanceof FormData) {
      processedBody = body;
    } else if (typeof body === 'object' && !objectIsEmpty(body)) {
      processedBody = JSON.stringify(body);
      requestHeaders['Content-Type'] = 'application/json';
    } else {
      processedBody = body;
    }
  }
  
  return {
    method,
    headers: requestHeaders,
    body: processedBody,
    credentials: 'include' as RequestCredentials,
    cache: cache as RequestCache,
  };
};

/**
 * Process API response
 */
const processResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 401) {
    throw new UnauthenticatedError('You must be authenticated to do this.');
  }
  
  // First get the response as text
  const text = await response.text();
  
  // Try to parse as JSON
  try {
    const data = text ? JSON.parse(text) : {};
    
    // Check for error responses
    if (!response.ok) {
      if (response.status === 403) {
        if (UserService.isPublicUser()) {
          window.location.href = '/public/sign-out';
        }
        throw new Error(data.message || 'You do not have permission to access this resource.');
      }
      
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = `Received unexpected response from server. ${response.status}: ${response.statusText}`;
      console.error(`${message}. Response: ${text}`);
      throw new UnexpectedResponseError(message);
    }
    throw error;
  }
};

/**
 * Universal API request function - Promise based (for use with React Query)
 */
export async function apiRequest<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  try {
    const url = createUrl(path, options.queryParams);
    const requestOptions = prepareOptions(options);
    
    const response = await fetch(url, requestOptions);
    return await processResponse<T>(response);
  } catch (error) {
    if (error instanceof UnauthenticatedError && 
        !UserService.isLoggedIn() && 
        window.location.pathname !== '/login') {
      window.location.href = `/login?original_url=${UserService.getCurrentLocation()}`;
    }
    throw error;
  }
}

/**
 * API Service for React Query integration and modern promise-based API calls
 */
const ApiService = {
  get: <T = any>(path: string, options: Omit<ApiOptions, 'method' | 'body'> = {}) => 
    apiRequest<T>(path, { ...options, method: 'GET' }),
    
  post: <T = any>(path: string, body?: any, options: Omit<ApiOptions, 'method'> = {}) => 
    apiRequest<T>(path, { ...options, method: 'POST', body }),
    
  put: <T = any>(path: string, body?: any, options: Omit<ApiOptions, 'method'> = {}) => 
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
    
  patch: <T = any>(path: string, body?: any, options: Omit<ApiOptions, 'method'> = {}) => 
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
    
  delete: <T = any>(path: string, options: Omit<ApiOptions, 'method'> = {}) => 
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};

export default ApiService;