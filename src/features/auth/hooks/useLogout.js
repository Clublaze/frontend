// features/auth/hooks/useLogout.js
import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearAuth } from '@store/authSlice'
import { queryClient } from '@services/queryClient'
import { logoutUser } from '../auth.api.js'

export function useLogout() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      dispatch(clearAuth())              // wipe Redux + localStorage
      queryClient.clear()               // wipe all TanStack Query cache
      navigate('/login')
    },
    onSettled: () => {
      // Even if the API call fails, clear client state
      // so user isn't stuck in a broken logged-in state
      dispatch(clearAuth())
      queryClient.clear()
      navigate('/login')
    },
  })
}