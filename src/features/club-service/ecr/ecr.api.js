import api from '@services/api.client';

export const ecrApi = {
  submit: (eventId, data) => api.post(`/ecr/${eventId}`, data),
  approve: (ecrId) => api.patch(`/ecr/${ecrId}/approve`),
  reject: (ecrId, data) => api.patch(`/ecr/${ecrId}/reject`, data),
  getByEvent: (eventId) => api.get(`/ecr/event/${eventId}`),
};
