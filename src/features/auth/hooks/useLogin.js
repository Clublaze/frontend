// features/auth/hooks/useLogin.js
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { setAuth } from '@store/authSlice'
import { loginUser } from '../auth.api.js'

export function useLogin() {
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: (credentials) => loginUser(credentials),

    onSuccess: (data) => {
      // Backend set the httpOnly cookie automatically in the response
      // data contains the user info your backend returns in the body
      // e.g. { user: {...}, canonicalRole: 'CLUB_LEAD', universityId: '...' }
      dispatch(setAuth({
        user:           data.user,
        canonicalRole:  data.canonicalRole,
        scopeId:        data.scopeId,
        universityId:   data.universityId,
        universityName: data.universityName,
        sessionId:      data.sessionId,
      }))
      // No JWT decoding needed — backend sends user info directly in response body
    },
  })
}