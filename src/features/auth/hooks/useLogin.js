import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApiErrorMessage, login } from '@auth/api/auth.api';
import { setCredentials } from '@auth/authSlice';

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      const decoded = jwtDecode(accessToken);

      dispatch(
        setCredentials({
          accessToken,
          user: {
            id: decoded.sub,
            userType: decoded.type,
            universityId: decoded.universityId,
          },
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
