function startCase(value) {
  return value
    ?.toLowerCase()
    .split(/[_\s]+/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function getUserDisplayName(user) {
  if (user?.name) {
    return user.name;
  }

  if (user?.fullName) {
    return user.fullName;
  }

  if (user?.email) {
    return user.email.split('@')[0];
  }

  if (user?.userType) {
    return startCase(user.userType);
  }

  return 'Campus Member';
}

export function getUserInitials(user) {
  const displayName = getUserDisplayName(user);
  const parts = displayName.split(/[\s._-]+/).filter(Boolean);

  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'UH';
}

export function getGreetingLabel(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 17) {
    return 'Good afternoon';
  }

  return 'Good evening';
}
