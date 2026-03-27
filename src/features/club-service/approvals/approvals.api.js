import api from '@services/api.client';

export const approvalsApi = {
  getDashboard: (params) => api.get('/approvals/dashboard', { params }),
  approve: (stepId, data) => api.patch(`/approvals/${stepId}/approve`, data),
  reject: (stepId, data) => api.patch(`/approvals/${stepId}/reject`, data),
  getByEvent: (eventId) => api.get(`/approvals/event/${eventId}`),
};
