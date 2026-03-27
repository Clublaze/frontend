import { useSelector } from 'react-redux'
import { selectCanonicalRole } from '@store/authSlice'
import { canDo, isApprover } from '@utils/permissions.util'

// Use this in every component that conditionally renders based on role.
// Never write: if (user.role === 'PRESIDENT') — always use can()
//
// Example:
// const { can } = usePermission()
// {can('SUBMIT_EVENT') && <SubmitButton />}
export function usePermission() {
  const canonicalRole = useSelector(selectCanonicalRole)
  return {
    can:          (permission) => canDo(canonicalRole, permission),
    isApprover:   ()           => isApprover(canonicalRole),
    canonicalRole,
  }
}