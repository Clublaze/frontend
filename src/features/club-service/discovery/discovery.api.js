import api from '@services/api.client';

export const discoveryApi = {
  discoverClubs: (params) => api.get('/discovery/clubs', { params }),
  searchAll: (query) => api.get('/discovery/search', { params: { q: query } }),
  getClubProfile: (clubId) => api.get(`/discovery/clubs/${clubId}`),
  getPublicEvents: (params) => api.get('/discovery/events', { params }),
  getPublicEvent: (eventId) => api.get(`/discovery/events/${eventId}`),
};
