export function normalizeAuthUser(payload) {
  if (!payload) {
    return null;
  }

  const rawUser = payload.user ?? payload;

  return {
    ...rawUser,
    id: rawUser.id ?? rawUser.sub ?? null,
    userType: rawUser.userType ?? rawUser.type ?? null,
    universityId: rawUser.universityId ?? null,
    permissions: Array.isArray(rawUser.permissions) ? rawUser.permissions : [],
  };
}
