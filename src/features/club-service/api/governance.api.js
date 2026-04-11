import { clubApi } from '@services/axios';

export async function getGovernanceTemplates() {
  const response = await clubApi.get('/governance/templates');
  return response.data.data ?? [];
}

export async function getGovernanceConfig(scopeId) {
  const response = await clubApi.get(`/governance/configs/${scopeId}`);
  return response.data.data;
}
