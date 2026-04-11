import { clubApi } from '@services/axios';

export async function getOrganizationTree() {
  const response = await clubApi.get('/organizations/tree');
  return response.data.data ?? [];
}
