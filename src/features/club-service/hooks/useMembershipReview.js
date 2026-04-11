import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { approveMembership, rejectMembership } from '@club/api/memberships.api';

function invalidateMembershipQueries(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['club-service', 'memberships'] });
}

export function useApproveMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId) => approveMembership(membershipId),
    onSuccess: () => {
      invalidateMembershipQueries(queryClient);
      toast.success('Membership approved.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not approve membership.');
    },
  });
}

export function useRejectMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ membershipId, reason }) => rejectMembership(membershipId, reason),
    onSuccess: () => {
      invalidateMembershipQueries(queryClient);
      toast.success('Membership rejected.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not reject membership.');
    },
  });
}
