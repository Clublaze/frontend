import EventCard from '@club/components/EventCard';
import DashboardCard from '@dashboard/components/DashboardCard';

function EventSection({ events = [] }) {
  return (
    <DashboardCard actionLabel="Open Events" icon="events" title="Event Pipeline">
      <div className="space-y-3">
        {events.length ? (
          events.map((event) => <EventCard event={event} key={event._id} />)
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">
            You have not created any events yet.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

export default EventSection;
