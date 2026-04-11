import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getApiErrorMessage, resendVerificationEmail } from '@auth/api/auth.api';

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      toast.success('Verification email sent. Check your inbox.');
    },
    onError: (error) => {
      if (error?.response?.status === 429) {
        toast.error('Email already sent. Please check your inbox or wait a moment.');
        return;
      }

      toast.error(getApiErrorMessage(error, 'Could not resend verification email.'));
    },
  });
}
