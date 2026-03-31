import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getApiErrorMessage, signup } from '@auth/api/auth.api';

export function useSignup() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: (_, variables) => {
      const verificationContext = new URLSearchParams({
        email: variables.email,
      });

      toast.success('Account created. Please verify your email before logging in.');
      navigate(`/verify-email?${verificationContext.toString()}`, {
        replace: true,
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to create your account.'));
    },
  });
}
