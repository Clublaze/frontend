import { clubApi } from '@services/axios';

export async function getApprovalDashboard() {
  const response = await clubApi.get('/approvals/dashboard');
  return response.data.data ?? [];
}

export async function approveStep(stepId, comments = '') {
  const response = await clubApi.post(`/approvals/${stepId}/approve`, { comments });
  return response.data.data;
}

export async function rejectStep(stepId, reason) {
  const response = await clubApi.post(`/approvals/${stepId}/reject`, { reason });
  return response.data.data;
}

export async function getApprovalHistory(eventId) {
  const response = await clubApi.get(`/approvals/${eventId}/history`);
  return response.data.data ?? [];
}
