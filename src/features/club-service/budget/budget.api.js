import api from '@services/api.client';

export const budgetApi = {
  submit: (eventId, data) => api.post(`/budget/${eventId}`, data),
  approve: (budgetId) => api.patch(`/budget/${budgetId}/approve`),
  reject: (budgetId, data) => api.patch(`/budget/${budgetId}/reject`, data),
  getByEvent: (eventId) => api.get(`/budget/event/${eventId}`),
  submitSettlement: (budgetId, data) => api.post(`/budget/${budgetId}/settlement`, data),
};
