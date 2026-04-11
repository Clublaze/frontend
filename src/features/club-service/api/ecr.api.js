import { clubApi } from '@services/axios';

export async function submitEcr(eventId, payload) {
  const response = await clubApi.post(`/ecr/${eventId}`, payload);
  return response.data.data;
}

export async function getEcr(eventId) {
  const response = await clubApi.get(`/ecr/${eventId}`);
  return response.data.data;
}

export async function approveEcr(eventId) {
  const response = await clubApi.post(`/ecr/${eventId}/approve`);
  return response.data.data;
}
