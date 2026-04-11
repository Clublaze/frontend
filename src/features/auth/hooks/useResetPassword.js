import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApiErrorMessage, resetPassword } from '@auth/api/auth.api';

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response?.message ?? 'Password reset successfully.');
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to reset password.'));
    },
  });
}
