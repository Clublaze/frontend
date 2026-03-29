import { useSelector } from 'react-redux'
import {
  selectUser, selectCanonicalRole, selectScopeId,
  selectUniversityId, selectUniversityName, selectSessionId, selectIsLoggedIn,
} from '@store/authSlice'

export function useCurrentUser() {
  return {
    user:           useSelector(selectUser),
    canonicalRole:  useSelector(selectCanonicalRole),
    scopeId:        useSelector(selectScopeId),
    universityId:   useSelector(selectUniversityId),
    universityName: useSelector(selectUniversityName),
    sessionId:      useSelector(selectSessionId),
    isLoggedIn:     useSelector(selectIsLoggedIn),
  }
}