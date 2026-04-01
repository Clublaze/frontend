import axios from 'axios';
import { clearAuth, setCredentials } from '@auth/authSlice';
import { logout } from '@auth/logout';
import { store } from '@store/store';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
let isRefreshing = false;
let refreshPromise = null;

const api = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes('/auth/refresh')) {
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = api
          .post('/auth/refresh')
          .then((response) => {
            const newToken = response.data.data.accessToken;

            store.dispatch(setCredentials({ accessToken: newToken }));
            return newToken;
          })
          .catch((refreshError) => {
            logout();
            throw refreshError;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default api;
