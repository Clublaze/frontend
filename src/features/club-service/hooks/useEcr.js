import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { approveEcr, getEcr, submitEcr } from '@club/api/ecr.api';

export function useEcr(eventId) {
  return useQuery({
    queryKey: ['club-service', 'ecr', eventId],
    queryFn: () => getEcr(eventId),
    enabled: !!eventId,
    retry: false,
  });
}

export function useSubmitEcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, payload }) => submitEcr(eventId, payload),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'ecr', eventId] });
      queryClient.invalidateQueries({ queryKey: ['club-service', 'events'] });
      toast.success('Event Completion Report submitted.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not submit ECR.');
    },
  });
}

export function useApproveEcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => approveEcr(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'ecr', eventId] });
      toast.success('ECR approved.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not approve ECR.');
    },
  });
}
