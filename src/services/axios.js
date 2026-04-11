import axios from 'axios';
import { clearAuth, setCredentials } from '@store/authSlice';
import { normalizeAuthUser } from '@auth/utils/normalizeAuthUser';
import { logout } from '@auth/logout';
import { store } from '@store/store';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL;
const CLUB_SERVICE_BASE_URL =
  import.meta.env.VITE_CLUB_SERVICE_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8002/api/v1';
let isRefreshing = false;
let refreshPromise = null;

function createApiClient(baseURL) {
  return axios.create({
    baseURL,
    timeout: 10_000,
    withCredentials: true,
  });
}

const authApi = createApiClient(AUTH_BASE_URL);
const clubApi = createApiClient(CLUB_SERVICE_BASE_URL);

function attachAuthHeader(config) {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

authApi.interceptors.request.use(attachAuthHeader);
clubApi.interceptors.request.use(attachAuthHeader);

async function refreshAccessToken() {
  if (!isRefreshing) {
    isRefreshing = true;

    refreshPromise = authApi
      .post('/api/auth/refresh')
      .then((response) => {
        const newToken = response.data.data.accessToken;
        const currentUser = normalizeAuthUser(store.getState().auth.user);

        store.dispatch(
          setCredentials({
            accessToken: newToken,
            user: currentUser,
          }),
        );

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

  return refreshPromise;
}

function attachRefreshInterceptor(client) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest?.url?.includes('/api/auth/refresh')) {
        store.dispatch(clearAuth());
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const newToken = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return client(originalRequest);
      }

      return Promise.reject(error);
    },
  );
}

attachRefreshInterceptor(authApi);
attachRefreshInterceptor(clubApi);

export { authApi, clubApi };

export default authApi;
