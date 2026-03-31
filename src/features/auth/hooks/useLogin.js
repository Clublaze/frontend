import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getApiErrorMessage, login } from '@auth/api/auth.api';
import { setCredentials } from '@auth/authSlice';

export function useLogin() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      dispatch(setCredentials({ accessToken, user: null }));
      toast.success('Login successful.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to sign in. Please try again.'));
    },
  });
}
