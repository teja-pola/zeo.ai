import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, CHAT_API_BASE_URL, FEATURE_FLAGS } from '@/config';

// Create axios instance with base config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // Increased to 30 seconds for video session initialization
  withCredentials: FEATURE_FLAGS.ENABLE_AUTH,
});

// Request interceptor for auth
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {} as any;
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle different HTTP status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access - please login again');
          // Optionally redirect to login
          if (FEATURE_FLAGS.ENABLE_AUTH) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 429:
          console.error('Too many requests - please try again later');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error('Request failed with status:', error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export { api };

export const chatApi: AxiosInstance = axios.create({
  baseURL: CHAT_API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  timeout: 15000,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (FEATURE_FLAGS.ENABLE_AUTH) {
      localStorage.setItem('authToken', token);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    if (FEATURE_FLAGS.ENABLE_AUTH) {
      localStorage.removeItem('authToken');
    }
  }
};

// Helper function for handling API errors
export const handleApiError = (error: unknown): { message: string; status?: number } => {
  const axiosError = error as AxiosError;
  if (axiosError.response) {
    return {
      message: (axiosError.response.data as any)?.message || axiosError.message,
      status: axiosError.response.status,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};
