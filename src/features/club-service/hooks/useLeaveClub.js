import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { leaveClub } from '@club/api/memberships.api';

export function useLeaveClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clubId) => leaveClub(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'memberships', 'my'] });
      toast.success('You have left the club.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not leave club.');
    },
  });
}
