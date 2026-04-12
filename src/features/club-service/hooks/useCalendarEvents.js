import { useQuery } from '@tanstack/react-query';
import { getUpcomingEvents } from '@club/api/discovery.api';
import { getEventsByDateRange } from '@club/api/events.api';

const CALENDAR_STALE_TIME = 5 * 60 * 1000;

export function useCalendarEvents(year, month) {
  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const myEventsQuery = useQuery({
    queryKey: ['club-service', 'calendar', 'my-events', year, month],
    queryFn: () => getEventsByDateRange({ from, to }),
    staleTime: CALENDAR_STALE_TIME,
  });

  const publicEventsQuery = useQuery({
    queryKey: ['club-service', 'calendar', 'public-events', year, month],
    queryFn: () => getUpcomingEvents(100),
    staleTime: CALENDAR_STALE_TIME,
  });

  const myEvents = Array.isArray(myEventsQuery.data) ? myEventsQuery.data : [];
  const publicEvents = Array.isArray(publicEventsQuery.data) ? publicEventsQuery.data : [];

  const eventsMap = new Map();

  for (const event of myEvents) {
    if (!event?._id) continue;
    eventsMap.set(String(event._id), event);
  }

  for (const event of publicEvents) {
    if (!event?._id) continue;

    const eventId = String(event._id);
    if (!eventsMap.has(eventId)) {
      eventsMap.set(eventId, event);
    }
  }

  const allEvents = Array.from(eventsMap.values());
  const eventsByDate = {};

  for (const event of allEvents) {
    if (!event?.startDate || !event?.endDate) continue;

    const [sy, sm, sd] = event.startDate.slice(0, 10).split('-').map(Number);
    const [ey, em, ed] = event.endDate.slice(0, 10).split('-').map(Number);

    const start = new Date(sy, sm - 1, sd, 12);
    const end = new Date(ey, em - 1, ed, 12);
    const cursor = new Date(start);

    while (cursor <= end) {
      if (cursor.getMonth() === month && cursor.getFullYear() === year) {
        const key = cursor.toISOString().slice(0, 10);
        eventsByDate[key] = eventsByDate[key] ?? [];
        eventsByDate[key].push(event);
      }

      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(12, 0, 0, 0);
    }
  }

  return {
    eventsByDate,
    allEvents,
    isLoading: myEventsQuery.isLoading || publicEventsQuery.isLoading,
    isError: myEventsQuery.isError && publicEventsQuery.isError,
  };
}
