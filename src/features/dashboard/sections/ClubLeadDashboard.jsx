import { Link } from 'react-router-dom';
import GlowStat from '@ds/components/GlowStat';
import EmptyState from '@ds/components/EmptyState';
import DashboardCard from '@dashboard/components/DashboardCard';
import EventCard from '@club/components/EventCard';
import MemberCard from '@club/components/MemberCard';

function ClubLeadDashboard({ dashboard }) {
  const { stats = {}, createdEvents = [], pendingMemberships = [] } = dashboard;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlowStat icon="clubs" label="Managed Clubs" theme="brand" value={stats.managedClubs ?? 0} />
        <GlowStat icon="memberships" label="Pending Reviews" theme="neutral" value={stats.pendingMembershipReviews ?? 0} />
        <GlowStat icon="events" label="My Events" theme="success" value={stats.createdEvents ?? 0} />
        <GlowStat icon="approvals" label="Pending Approvals" theme="danger" value={stats.approvalsPending ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          icon="events"
          title="Event Pipeline"
          actionLabel={<Link to="/dashboard/events" className="text-sm text-[var(--color-brand)]">Open Events →</Link>}
        >
          {createdEvents.length === 0
            ? <EmptyState icon="events" title="No events yet" description="Create your first event." />
            : createdEvents.slice(0, 4).map((event) => <EventCard key={event._id} event={event} />)}
        </DashboardCard>

        <DashboardCard
          icon="memberships"
          title="Membership Queue"
          actionLabel={<Link to="/dashboard/memberships" className="text-sm text-[var(--color-brand)]">Review →</Link>}
        >
          {pendingMemberships.length === 0
            ? <EmptyState icon="memberships" title="No pending applications" />
            : pendingMemberships.slice(0, 4).map((membership) => <MemberCard key={membership._id} membership={membership} />)}
        </DashboardCard>
      </div>
    </div>
  );
}

export default ClubLeadDashboard;
