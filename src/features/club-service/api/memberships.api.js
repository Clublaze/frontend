import { clubApi } from '@services/axios';

export async function getMyMemberships() {
  const response = await clubApi.get('/memberships/my');
  return response.data.data ?? [];
}

export async function getPendingMemberships(clubId) {
  const response = await clubApi.get(`/memberships/club/${clubId}/pending`);
  return response.data.data ?? [];
}

export async function applyToClub(clubId, applicationNote = '') {
  const response = await clubApi.post('/memberships/apply', { clubId, applicationNote });
  return response.data.data;
}

export async function leaveClub(clubId) {
  const response = await clubApi.delete(`/memberships/${clubId}/leave`);
  return response.data.data;
}

export async function approveMembership(membershipId) {
  const response = await clubApi.post(`/memberships/${membershipId}/approve`);
  return response.data.data;
}

export async function rejectMembership(membershipId, reason) {
  const response = await clubApi.post(`/memberships/${membershipId}/reject`, { reason });
  return response.data.data;
}

export async function getClubMembers(clubId, page = 1, limit = 20) {
  const response = await clubApi.get(`/memberships/club/${clubId}`, {
    params: { page, limit },
  });
  return response.data.data;
}
