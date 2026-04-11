import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { applyToClub } from '@club/api/memberships.api';

export function useJoinClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clubId, applicationNote = '' }) => applyToClub(clubId, applicationNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'memberships', 'my'] });
      toast.success('Application submitted successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not submit application.');
    },
  });
}
