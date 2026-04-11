import { Link } from 'react-router-dom';
import GlowStat from '@ds/components/GlowStat';
import EmptyState from '@ds/components/EmptyState';
import DashboardCard from '@dashboard/components/DashboardCard';
import EventCard from '@club/components/EventCard';

function MembershipRow({ membership }) {
  const clubName = membership.club?.name ?? 'Club';
  const societyName = membership.club?.type === 'CLUB'
    ? (membership.club?.parentName ?? '')
    : '';
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-2.5 hover:bg-[var(--color-surface-soft)]">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{clubName}</p>
        {societyName && (
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{societyName}</p>
        )}
      </div>
      <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
        {membership.memberCount ? `${membership.memberCount} members` : ''}
      </span>
    </div>
  );
}

function SuggestedClubRow({ club }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">{club.name}</p>
      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
        {club.type} · {club.memberCount ?? '—'} members
      </p>
    </div>
  );
}

function StudentDashboard({ dashboard }) {
  const {
    stats = {},
    memberships = [],
    upcomingEvents = [],
    discoveredClubs = [],
  } = dashboard;

  const activeIds = new Set(
    memberships.filter((membership) => membership.status === 'ACTIVE').map((membership) => String(membership.clubId))
  );
  const suggested = discoveredClubs
    .filter((club) => !activeIds.has(String(club._id)))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlowStat icon="clubs" label="My Clubs" theme="brand" value={stats.membershipsActive ?? 0} />
        <GlowStat icon="events" label="Upcoming Events" theme="success" value={stats.upcomingEvents ?? 0} />
        <GlowStat icon="memberships" label="Active Memberships" theme="neutral" value={stats.membershipsActive ?? 0} />
        <GlowStat icon="leaderboard" label="Events Attended" theme="danger" value={0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          icon="clubs"
          title="My Clubs"
          actionLabel={<Link to="/dashboard/memberships" className="text-sm text-[var(--color-brand)]">View All →</Link>}
        >
          {memberships.filter((membership) => membership.status === 'ACTIVE').length === 0
            ? <EmptyState icon="clubs" title="No clubs yet" description="Explore clubs to join." />
            : memberships.filter((membership) => membership.status === 'ACTIVE').slice(0, 3).map((membership) => (
              <MembershipRow key={membership._id} membership={membership} />
            ))}
        </DashboardCard>

        <DashboardCard
          icon="events"
          title="Upcoming Events"
          actionLabel={<Link to="/dashboard/events" className="text-sm text-[var(--color-brand)]">View All →</Link>}
        >
          {upcomingEvents.length === 0
            ? <EmptyState icon="events" title="No upcoming events" />
            : upcomingEvents.slice(0, 3).map((event) => <EventCard key={event._id} event={event} />)}
        </DashboardCard>
      </div>

      {suggested.length > 0 && (
        <DashboardCard
          icon="explore"
          title="Suggested Clubs"
          actionLabel={<Link to="/dashboard/clubs" className="text-sm text-[var(--color-brand)]">View All →</Link>}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {suggested.map((club) => <SuggestedClubRow key={club._id} club={club} />)}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}

export default StudentDashboard;
