import api from '@services/api.client';

export const auditApi = {
  getFeed: (params) => api.get('/audit/feed', { params }),
  getEventTimeline: (eventId) => api.get(`/audit/events/${eventId}/timeline`),
};
