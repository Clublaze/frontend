import api from '@services/api.client';

export const eventsApi = {
  list: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  submit: (id) => api.patch(`/events/${id}/submit`),
  delete: (id) => api.delete(`/events/${id}`),
};
