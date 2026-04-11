export const mainNavigationItems = [
  { label: 'Dashboard', icon: 'dashboard', to: '/dashboard', permission: null },
  { label: 'Explore', icon: 'explore', to: '/dashboard/explore', permission: null },
  { label: 'Events', icon: 'events', to: '/dashboard/events', permission: null },
  { label: 'Clubs', icon: 'clubs', to: '/dashboard/clubs', permission: null },
  { label: 'Societies', icon: 'societies', to: '/dashboard/societies', permission: null },
  { label: 'Approvals', icon: 'approvals', to: '/dashboard/approvals', permission: 'APPROVE_STEP' },
  { label: 'Memberships', icon: 'memberships', to: '/dashboard/memberships', permission: null },
  { label: 'Audit Panel', icon: 'audit', to: '/dashboard/audit', permission: 'VIEW_APPROVALS' },
  { label: 'Governance', icon: 'governance', to: '/dashboard/governance', permission: 'ASSIGN_ROLES' },
  { label: 'Leaderboard', icon: 'leaderboard', to: '/dashboard/leaderboard', permission: null },
];

export const accountNavigationItems = [
  { label: 'Profile', icon: 'profile', to: '/dashboard/profile', permission: null },
  { label: 'Settings', icon: 'settings', to: '/dashboard/settings', permission: null },
  { label: 'Help', icon: 'help', to: '/dashboard/help', permission: null },
];
