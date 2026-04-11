import MemberCard from '@club/components/MemberCard';
import DashboardCard from '@dashboard/components/DashboardCard';

function MemberSection({ pending = [], memberships = [] }) {
  void memberships;
  const items = pending;

  return (
    <DashboardCard actionLabel="Review" icon="memberships" title="Membership Queue">
      <div className="space-y-3">
        {items.length ? (
          items.map((membership) => <MemberCard key={membership._id} membership={membership} />)
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">
            No pending membership applications right now.
          </p>
        )}
      </div>
    </DashboardCard>
  );
}

export default MemberSection;
