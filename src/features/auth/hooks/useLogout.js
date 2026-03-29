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
    onSettled: () => {
      dispatch(clearAuth())
      queryClient.clear()
      navigate('/login')
    },
  })
}