import api from '@services/api.client';

export const organizationsApi = {
  getTree: (universityId) => api.get(`/organizations/tree/${universityId}`),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`),
};
