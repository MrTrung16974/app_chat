import axios from 'axios';
import { getAuthToken } from '@/store/authStore';
import { mockServer } from '@/services/mock/server';

export const apiClient = axios.create({
  baseURL: '/api',
  adapter: async (config) => {
    return mockServer.handle(config);
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  if (__DEV__) {
    console.log('[API]', config.method?.toUpperCase(), config.url);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('[API]', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.log('[API]', 'ERROR', error?.response?.status, error?.config?.url);
    }
    return Promise.reject(error);
  },
);
