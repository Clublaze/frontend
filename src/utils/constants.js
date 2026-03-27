// Fallback display labels for canonical roles
// Prefer roleAssignment.displayRoleName from the API first
// Use these as fallback: displayRoleName ?? ROLE_LABELS[canonicalRole]
export const ROLE_LABELS = {
  PRESIDENT:        'President',
  VICE_PRESIDENT:   'Vice President',
  SECRETARY:        'Secretary',
  TREASURER:        'Treasurer',
  PR_HEAD:          'PR Head',
  CLUB_LEAD:        'Club Lead',
  CO_LEAD:          'Co-Lead',
  COORDINATOR:      'Coordinator',
  FACULTY_ADVISOR:  'Faculty Advisor',
  HOD:              'Head of Department',
  DEAN:             'Dean',
}

export const EVENT_STATUSES = [
  'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ECR_PENDING', 'CLOSED',
]

export const EVENT_CATEGORIES = [
  'WORKSHOP', 'SEMINAR', 'HACKATHON', 'COMPETITION', 'CULTURAL',
  'GUEST_LECTURE', 'FDP', 'WEBINAR', 'INDUSTRIAL_VISIT', 'OTHER',
]

export const ORG_TYPES = ['SCHOOL', 'SOCIETY', 'CLUB']

// Sidebar nav items — permission: null means visible to all logged-in users
export const NAV_ITEMS = [
  { label: 'Dashboard',   path: '/dashboard',   icon: 'Home',        permission: null },
  { label: 'My Events',   path: '/events',       icon: 'Calendar',    permission: 'CREATE_EVENT' },
  { label: 'Approvals',   path: '/approvals',    icon: 'CheckCircle', permission: 'APPROVE_STEP' },
  { label: 'Members',     path: '/memberships',  icon: 'Users',       permission: 'MANAGE_MEMBERS' },
  { label: 'Roles',       path: '/roles',        icon: 'Shield',      permission: 'ASSIGN_ROLES' },
  { label: 'Audit Panel', path: '/audit',        icon: 'FileText',    permission: 'VIEW_APPROVALS' },
  { label: 'Discover',    path: '/discover',     icon: 'Compass',     permission: null },
]