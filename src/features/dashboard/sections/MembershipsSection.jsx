import EventCard from '@club/components/EventCard';
import MemberCard from '@club/components/MemberCard';
import DashboardCard from '@dashboard/components/DashboardCard';

function MembershipsSection({ memberships = [], upcomingEvents = [], discoveredClubs = [] }) {
  void discoveredClubs;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardCard actionLabel="View All" icon="memberships" title="My Memberships">
        <div className="space-y-3">
          {memberships.slice(0, 3).length ? (
            memberships
              .slice(0, 3)
              .map((membership) => <MemberCard key={membership._id} membership={membership} />)
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No memberships yet. Explore clubs from the sidebar.
            </p>
          )}
        </div>
      </DashboardCard>

      <DashboardCard actionLabel="View All" icon="events" title="Upcoming Events">
        <div className="space-y-3">
          {upcomingEvents.slice(0, 3).length ? (
            upcomingEvents
              .slice(0, 3)
              .map((event) => <EventCard event={event} key={event._id} />)
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              There are no upcoming events right now.
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}

export default MembershipsSection;
