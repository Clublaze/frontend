import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageHeader from '@ds/components/PageHeader';
import Avatar from '@ds/components/Avatar';
import InfoRow from '@ds/components/InfoRow';
import SectionLabel from '@ds/components/SectionLabel';
import StatusBadge from '@ds/components/StatusBadge';
import EventCard from '@club/components/EventCard';
import { selectUser } from '@store/authSlice';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { formatDate } from '@dashboard/utils/dashboardFormatters';

function ProfilePage() {
  const dashboard = useOutletContext() ?? {};
  const user = useSelector(selectUser);

  const displayName = user?.name ?? user?.fullName ?? user?.email?.split('@')[0] ?? 'Student';
  const activeRoles = (dashboard.roles ?? []).filter((role) => role.status !== 'REMOVED');
  const memberships = dashboard.memberships ?? [];
  const createdEvents = dashboard.createdEvents ?? [];

  return (
    <div className="space-y-8">
      <PageHeader title="Profile" description="Your account details and activity on UniHub." />

      <section className="card-surface p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <Avatar name={displayName} size="xl" />
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              {displayName}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {user?.userType?.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5">
          <SectionLabel>Account Information</SectionLabel>
          <div className="mt-3 space-y-2">
            <InfoRow label="Email" value={user?.email} />
            {user?.universityId ? (
              <InfoRow label="University ID" value={String(user.universityId)} />
            ) : null}
            {user?.systemId ? (
              <InfoRow label="System ID" value={user.systemId} />
            ) : null}
            <InfoRow label="Account Type" value={user?.userType?.replace(/_/g, ' ')} />
          </div>
        </div>
      </section>

      {activeRoles.length > 0 ? (
        <section className="space-y-3">
          <SectionLabel>Active Roles</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {activeRoles.map((role) => (
              <article key={role._id} className="card-surface-muted p-4">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  {formatCanonicalRole(role.canonicalRole)}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {role.displayRoleName && role.displayRoleName !== role.canonicalRole
                    ? `${role.displayRoleName} - `
                    : ''}
                  {role.scopeType} - Session {role.sessionId}
                </p>
                <span className="mt-2 inline-block rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-brand)]">
                  Active
                </span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {memberships.length > 0 ? (
        <section className="space-y-3">
          <SectionLabel>Club Memberships</SectionLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {memberships.map((membership) => (
              <article
                key={membership._id}
                className="card-surface-muted flex items-center justify-between gap-3 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--color-text-primary)]">
                    {membership.club?.name ?? 'Club'}
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                    Since {formatDate(membership.appliedAt)}
                  </p>
                </div>
                <StatusBadge status={membership.status} type="event" />
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {createdEvents.length > 0 ? (
        <section className="space-y-3">
          <SectionLabel>Events Organised</SectionLabel>
          <div className="space-y-3">
            {createdEvents.slice(0, 5).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      ) : null}

      {activeRoles.length === 0 && memberships.length === 0 && createdEvents.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your activity will appear here as you join clubs and participate in events.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default ProfilePage;
