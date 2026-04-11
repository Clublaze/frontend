import { clubApi } from '@services/axios';

export async function getUpcomingEvents(limit = 6) {
  const response = await clubApi.get('/discover/events', { params: { limit } });
  const result = response.data.data;
  return Array.isArray(result) ? result : (result?.data ?? []);
}

export async function getClubs(limit = 6) {
  const response = await clubApi.get('/discover/clubs', { params: { limit } });
  const result = response.data.data;
  return Array.isArray(result) ? result : (result?.data ?? []);
}

export async function getSocieties() {
  const response = await clubApi.get('/discover/societies');
  return response.data.data ?? [];
}

export async function getClubProfile(clubId) {
  const response = await clubApi.get(`/discover/clubs/${clubId}`);
  return response.data.data;
}

export async function getSocietyProfile(societyId) {
  const response = await clubApi.get(`/discover/societies/${societyId}`);
  return response.data.data;
}

export async function searchDiscovery(query) {
  const response = await clubApi.get('/discover/search', { params: { q: query } });
  return response.data.data ?? { societies: [], clubs: [], events: [] };
}

export async function getPublicEvent(eventId) {
  const response = await clubApi.get(`/discover/events/${eventId}`);
  return response.data.data;
}
