import axios from 'axios';
import { store } from '@store/store';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;

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

export default api;
