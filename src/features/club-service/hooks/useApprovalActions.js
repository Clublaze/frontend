import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { approveStep, rejectStep } from '@club/api/approvals.api';

export function useApproveStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, comments = '' }) => approveStep(stepId, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'approvals'] });
      toast.success('Step approved successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not approve step.');
    },
  });
}

export function useRejectStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stepId, reason }) => rejectStep(stepId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'approvals'] });
      toast.success('Event rejected.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not reject step.');
    },
  });
}
