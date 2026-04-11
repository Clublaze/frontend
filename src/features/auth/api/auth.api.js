import api from '@services/axios';

export async function login(payload) {
  const response = await api.post('/api/auth/login', payload);
  return {
    accessToken: response.data.data.accessToken,
  };
}

export async function signup({ accountType, ...payload }) {
  const endpoint =
    accountType === 'faculty' ? '/api/auth/register/faculty' : '/api/auth/register/student';

  const response = await api.post(endpoint, payload);
  return response.data;
}

export async function verifyEmail(payload) {
  const response = await api.post('/api/auth/verify-email', payload);
  return response.data;
}

export async function getCurrentUser(accessToken) {
  const response = await api.get('/api/auth/me', {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });
  return response.data.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}
