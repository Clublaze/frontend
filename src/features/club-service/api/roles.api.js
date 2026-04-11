import { clubApi } from '@services/axios';

export async function getRolesForUser(userId) {
  const response = await clubApi.get(`/roles/user/${userId}`);
  return response.data.data ?? [];
}

export async function getRolesForScope(scopeId) {
  const response = await clubApi.get(`/roles/${scopeId}`);
  return response.data.data ?? [];
}

export async function assignRole(payload) {
  const response = await clubApi.post('/roles/assign', payload);
  return response.data.data;
}
