// Must stay in sync with engine/pbac.engine.js in club-service backend.
// When you add a permission to the backend, add it here too.
export const PERMISSIONS = {
  CREATE_EVENT:      ['CLUB_LEAD'],
  SUBMIT_EVENT:      ['CLUB_LEAD'],
  EDIT_EVENT:        ['CLUB_LEAD'],
  APPROVE_STEP:      ['SECRETARY','VICE_PRESIDENT','PRESIDENT','FACULTY_ADVISOR','HOD','DEAN'],
  REJECT_STEP:       ['SECRETARY','VICE_PRESIDENT','PRESIDENT','FACULTY_ADVISOR','HOD','DEAN'],
  SUBMIT_BUDGET:     ['CLUB_LEAD'],
  APPROVE_BUDGET:    ['SECRETARY','PRESIDENT','FACULTY_ADVISOR'],
  SUBMIT_ECR:        ['CLUB_LEAD'],
  APPROVE_ECR:       ['FACULTY_ADVISOR','HOD','DEAN'],
  ASSIGN_ROLES:      ['PRESIDENT','FACULTY_ADVISOR','HOD','DEAN'],
  MANAGE_MEMBERS:    ['CLUB_LEAD','CO_LEAD'],
  APPROVE_PROMOTION: ['FACULTY_ADVISOR','HOD','DEAN'],
  VIEW_APPROVALS:    ['SECRETARY','VICE_PRESIDENT','PRESIDENT','FACULTY_ADVISOR','HOD','DEAN'],
}

export const canDo = (canonicalRole, permission) =>
  PERMISSIONS[permission]?.includes(canonicalRole) ?? false

export const isApprover = (canonicalRole) =>
  PERMISSIONS.APPROVE_STEP.includes(canonicalRole)