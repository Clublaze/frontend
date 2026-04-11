import { clubApi } from '@services/axios';

export async function getUserAuditHistory(userId, limit = 5) {
  const response = await clubApi.get(`/audit/user/${userId}`, { params: { limit } });
  return response.data.data?.logs ?? [];
}

export async function getAuditFeed(limit = 6) {
  const response = await clubApi.get('/audit/feed', { params: { limit } });
  return response.data.data?.logs ?? [];
}

export async function getAuditFeedPaginated({ page = 1, limit = 20, action, entityType } = {}) {
  const params = { page, limit };
  if (action) params.action = action;
  if (entityType) params.entityType = entityType;

  const response = await clubApi.get('/audit/feed', { params });
  const result = response.data.data;

  return {
    logs: result?.logs ?? [],
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
  };
}
