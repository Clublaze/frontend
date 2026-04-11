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

export async function forgotPassword(payload) {
  const response = await api.post('/api/auth/forgot-password', payload);
  return response.data;
}

export async function resetPassword(payload) {
  const response = await api.post('/api/auth/reset-password', payload);
  return response.data;
}

export async function resendVerificationEmail() {
  const response = await api.post('/api/auth/resend-verification');
  return response.data;
}

export async function getAdminUsers({ page = 1, limit = 20, userType, search, universityId } = {}) {
  const params = { limit, page };

  if (userType) params.userType = userType;
  if (search) params.search = search;
  if (universityId) params.universityId = universityId;

  const response = await api.get('/api/auth/admin/users', { params });
  return response.data.data;
}

export async function blockUser({ userId, reason }) {
  const response = await api.post('/api/auth/admin/block-user', { reason, userId });
  return response.data;
}

export async function unblockUser({ userId }) {
  const response = await api.post('/api/auth/admin/unblock-user', { userId });
  return response.data;
}

export async function getUserLoginHistory(userId, { page = 1, limit = 20 } = {}) {
  const response = await api.get(`/api/auth/admin/users/${userId}/login-history`, {
    params: { limit, page },
  });
  return response.data.data;
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
