import { useSelector } from 'react-redux'
import {
  selectToken, selectUser, selectCanonicalRole, selectScopeId,
  selectUniversityId, selectUniversityName, selectSessionId, selectIsLoggedIn,
} from '@store/authSlice'

// Use this instead of calling useSelector repeatedly in every component
export function useCurrentUser() {
  return {
    token:          useSelector(selectToken),
    user:           useSelector(selectUser),
    canonicalRole:  useSelector(selectCanonicalRole),
    scopeId:        useSelector(selectScopeId),
    universityId:   useSelector(selectUniversityId),
    universityName: useSelector(selectUniversityName),
    sessionId:      useSelector(selectSessionId),
    isLoggedIn:     useSelector(selectIsLoggedIn),
  }
}