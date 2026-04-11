import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { forgotPassword, getApiErrorMessage } from '@auth/api/auth.api';

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response?.message ?? 'If this email is registered, a reset link has been sent.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Unable to send reset link.'));
    },
  });
}
