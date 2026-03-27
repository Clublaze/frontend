import api from '@services/api.client';

export const membershipApi = {
  apply: (clubId) => api.post(`/membership/${clubId}/apply`),
  review: (applicationId, data) => api.patch(`/membership/${applicationId}/review`, data),
  getMyClubs: () => api.get('/membership/my-clubs'),
  getMembers: (clubId, params) => api.get(`/membership/${clubId}/members`, { params }),
  removeMember: (memberId) => api.delete(`/membership/${memberId}`),
};
