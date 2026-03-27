import api from '@services/api.client';

export const rolesApi = {
  assign: (data) => api.post('/roles/assign', data),
  revoke: (assignmentId) => api.delete(`/roles/${assignmentId}`),
  getByScopeAndOrg: (scope, orgId) => api.get(`/roles/${scope}/${orgId}`),
  getMyRoles: () => api.get('/roles/me'),
};
