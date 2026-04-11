import { clubApi } from '@services/axios';

export async function getEvents(params = {}) {
  const response = await clubApi.get('/events', { params });
  const result = response.data.data;
  return Array.isArray(result) ? result : (result?.data ?? []);
}

export async function getEventById(eventId) {
  const response = await clubApi.get(`/events/${eventId}`);
  return response.data.data;
}

export async function createEvent(payload) {
  const response = await clubApi.post('/events', payload);
  return response.data.data;
}

export async function submitEvent(eventId) {
  const response = await clubApi.post(`/events/${eventId}/submit`);
  return response.data.data;
}

export async function resubmitEvent(eventId) {
  const response = await clubApi.post(`/events/${eventId}/resubmit`);
  return response.data.data;
}

export async function markEventComplete(eventId) {
  const response = await clubApi.post(`/events/${eventId}/complete`);
  return response.data.data;
}

export async function updateEvent(eventId, payload) {
  const response = await clubApi.patch(`/events/${eventId}`, payload);
  return response.data.data;
}
