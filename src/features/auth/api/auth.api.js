import api from '@services/axios';

export async function login(payload) {
  const response = await api.post('/auth/login', payload);
  return {
    accessToken: response.data.data.accessToken,
  };
}

export async function signup({ accountType, ...payload }) {
  const endpoint =
    accountType === 'faculty' ? '/auth/register/faculty' : '/auth/register/student';

  const response = await api.post(endpoint, payload);
  return response.data;
}
//to verify email
export async function verifyEmail(payload) {
  const response = await api.post('/auth/verify-email', payload);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data.data;
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}
