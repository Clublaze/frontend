import { useQueries } from '@tanstack/react-query';
import { getUpcomingEvents } from '@club/api/discovery.api';
import { getEvents } from '@club/api/events.api';

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function toPagedItems(result) {
  return Array.isArray(result?.data) ? result.data : toArray(result);
}

export function useEvents({ enabled = true, limit = 6, userId } = {}) {
  const [upcomingQuery, createdQuery] = useQueries({
    queries: [
      {
        queryKey: ['club-service', 'discover', 'events', limit],
        queryFn: () => getUpcomingEvents(limit),
        enabled,
      },
      {
        queryKey: ['club-service', 'events', 'created', userId, limit],
        queryFn: () => getEvents({ createdBy: userId, limit }),
        enabled: enabled && !!userId,
      },
    ],
  });

  return {
    data: {
      createdEvents: toPagedItems(createdQuery.data),
      upcomingEvents: toPagedItems(upcomingQuery.data),
    },
    error: upcomingQuery.error || createdQuery.error || null,
    isLoading: upcomingQuery.isLoading || createdQuery.isLoading,
  };
}

export default useEvents;
