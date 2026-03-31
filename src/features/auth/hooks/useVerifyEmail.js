import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getApiErrorMessage, verifyEmail } from '@auth/api/auth.api';

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (response) => {
      toast.success(response.message || 'Email verified successfully.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Email verification failed.'));
    },
  });
}
