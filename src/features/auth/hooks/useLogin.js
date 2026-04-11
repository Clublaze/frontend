import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApiErrorMessage, getCurrentUser, login } from '@auth/api/auth.api';
import { setCredentials } from '@store/authSlice';
import { normalizeAuthUser } from '@auth/utils/normalizeAuthUser';

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: async ({ accessToken }) => {
      const userResponse = await getCurrentUser(accessToken);
      const user = normalizeAuthUser(userResponse);

      dispatch(
        setCredentials({
          accessToken,
          user,
        }),
      );

      toast.success('Login successful.');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to sign in. Please try again.'));
    },
  });
}
