import { clubApi } from '@services/axios';

export async function getGovernanceTemplates() {
  const response = await clubApi.get('/governance/templates');
  return response.data.data ?? [];
}

export async function getGovernanceConfig(scopeId) {
  const response = await clubApi.get(`/governance/configs/${scopeId}`);
  return response.data.data;
}

export async function createGovernanceConfig(payload) {
  const response = await clubApi.post('/governance/configs', payload);
  return response.data.data;
}

export async function updateGovernanceConfig(scopeId, payload) {
  const response = await clubApi.put(`/governance/configs/${scopeId}`, payload);
  return response.data.data;
}

export async function getGovernanceConfigHistory(scopeId) {
  const response = await clubApi.get(`/governance/configs/${scopeId}/history`);
  return response.data.data ?? [];
}
