import { useSelector } from 'react-redux';
import { selectUser } from '@store/authSlice';

const ADMIN_TYPES = ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'];

const PERMISSIONS = {
  CREATE_EVENT: ['CLUB_LEAD'],
  SUBMIT_EVENT: ['CLUB_LEAD'],
  EDIT_EVENT: ['CLUB_LEAD'],
  APPROVE_STEP: ['SECRETARY', 'VICE_PRESIDENT', 'PRESIDENT', 'FACULTY_ADVISOR', 'HOD', 'DEAN'],
  REJECT_STEP: ['SECRETARY', 'VICE_PRESIDENT', 'PRESIDENT', 'FACULTY_ADVISOR', 'HOD', 'DEAN'],
  SUBMIT_BUDGET: ['CLUB_LEAD'],
  APPROVE_BUDGET: ['SECRETARY', 'PRESIDENT', 'FACULTY_ADVISOR'],
  SUBMIT_ECR: ['CLUB_LEAD'],
  APPROVE_ECR: ['FACULTY_ADVISOR', 'HOD', 'DEAN'],
  ASSIGN_ROLES: ['PRESIDENT', 'FACULTY_ADVISOR', 'HOD', 'DEAN'],
  MANAGE_MEMBERS: ['CLUB_LEAD', 'CO_LEAD'],
  APPROVE_PROMOTION: ['FACULTY_ADVISOR', 'HOD', 'DEAN'],
  VIEW_APPROVALS: ['SECRETARY', 'VICE_PRESIDENT', 'PRESIDENT', 'FACULTY_ADVISOR', 'HOD', 'DEAN'],
  SUBMIT_SETTLEMENT: ['CLUB_LEAD'],
  VIEW_AUDIT: ['SECRETARY', 'VICE_PRESIDENT', 'PRESIDENT', 'FACULTY_ADVISOR', 'HOD', 'DEAN'],
};

export function usePermission(roles = []) {
  const user = useSelector(selectUser);
  const isAdmin = ADMIN_TYPES.includes(user?.userType);
  const activeCanonicalRoles = roles
    .filter((role) => role.status !== 'REMOVED')
    .map((role) => role.canonicalRole);

  const can = (permission) => {
    if (isAdmin) {
      return true;
    }

    const allowed = PERMISSIONS[permission];

    if (!allowed) {
      return false;
    }

    return activeCanonicalRoles.some((role) => allowed.includes(role));
  };

  return { can, activeCanonicalRoles };
}

export function useIsAdmin() {
  const user = useSelector(selectUser);

  return ADMIN_TYPES.includes(user?.userType);
}
