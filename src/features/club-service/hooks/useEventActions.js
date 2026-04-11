import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  closeEvent,
  markEventComplete,
  resubmitEvent,
  submitEvent,
  updateEvent,
} from '@club/api/events.api';

function invalidateEvents(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['club-service', 'events'] });
  queryClient.invalidateQueries({ queryKey: ['club-service', 'discover', 'events'] });
}

export function useSubmitEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => submitEvent(eventId),
    onSuccess: () => {
      invalidateEvents(queryClient);
      toast.success('Event submitted for approval.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not submit event.');
    },
  });
}

export function useResubmitEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => resubmitEvent(eventId),
    onSuccess: () => {
      invalidateEvents(queryClient);
      toast.success('Event moved back to draft for editing.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not resubmit event.');
    },
  });
}

export function useMarkEventComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => markEventComplete(eventId),
    onSuccess: () => {
      invalidateEvents(queryClient);
      toast.success('Event marked as complete. Please submit the ECR.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not mark event as complete.');
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, payload }) => updateEvent(eventId, payload),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['club-service', 'events', 'detail', eventId] });
      toast.success('Event updated successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not update event.');
    },
  });
}

export function useCloseEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => closeEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['club-service', 'events', 'detail', eventId] });
      toast.success('Event closed successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not close event.');
    },
  });
}
