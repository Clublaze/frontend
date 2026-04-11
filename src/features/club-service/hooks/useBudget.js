import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  approveBudget,
  approveSettlement,
  getBudget,
  getSettlement,
  rejectBudget,
  submitBudget,
  submitSettlement,
} from '@club/api/budget.api';

export function useBudget(eventId) {
  return useQuery({
    queryKey: ['club-service', 'budget', eventId],
    queryFn: () => getBudget(eventId),
    enabled: !!eventId,
    retry: false,
  });
}

export function useSettlement(eventId) {
  return useQuery({
    queryKey: ['club-service', 'settlement', eventId],
    queryFn: () => getSettlement(eventId),
    enabled: !!eventId,
    retry: false,
  });
}

export function useSubmitBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, payload }) => submitBudget(eventId, payload),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'budget', eventId] });
      queryClient.invalidateQueries({ queryKey: ['club-service', 'events'] });
      toast.success('Budget submitted successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not submit budget.');
    },
  });
}

export function useApproveBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => approveBudget(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'budget', eventId] });
      toast.success('Budget approved.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not approve budget.');
    },
  });
}

export function useRejectBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, reason }) => rejectBudget(eventId, reason),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'budget', eventId] });
      toast.success('Budget rejected.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not reject budget.');
    },
  });
}

export function useSubmitSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, payload }) => submitSettlement(eventId, payload),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'settlement', eventId] });
      toast.success('Settlement submitted.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not submit settlement.');
    },
  });
}

export function useApproveSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => approveSettlement(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'settlement', eventId] });
      toast.success('Settlement approved.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not approve settlement.');
    },
  });
}
