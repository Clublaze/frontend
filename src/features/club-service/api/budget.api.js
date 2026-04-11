import { clubApi } from '@services/axios';

export async function submitBudget(eventId, payload) {
  const response = await clubApi.post(`/budgets/${eventId}`, payload);
  return response.data.data;
}

export async function getBudget(eventId) {
  const response = await clubApi.get(`/budgets/${eventId}`);
  return response.data.data;
}

export async function approveBudget(eventId) {
  const response = await clubApi.post(`/budgets/${eventId}/approve`);
  return response.data.data;
}

export async function rejectBudget(eventId, reason) {
  const response = await clubApi.post(`/budgets/${eventId}/reject`, { reason });
  return response.data.data;
}

export async function submitSettlement(eventId, payload) {
  const response = await clubApi.post(`/settlements/${eventId}`, payload);
  return response.data.data;
}

export async function approveSettlement(eventId) {
  const response = await clubApi.post(`/settlements/${eventId}/approve`);
  return response.data.data;
}

export async function getSettlement(eventId) {
  const response = await clubApi.get(`/settlements/${eventId}`);
  return response.data.data;
}
