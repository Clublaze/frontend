import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '@ds/components/Avatar';
import Button from '@ds/components/Button';
import EmptyState from '@ds/components/EmptyState';
import Loader from '@ds/components/Loader';
import EventCard from '@club/components/EventCard';
import { useClubProfile } from '@club/hooks/useClubProfile';
import { useJoinClub } from '@club/hooks/useJoinClub';
import { useMemberships } from '@club/hooks/useMemberships';
import Icon from '@dashboard/components/Icon';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';

function MembershipBadge({ status }) {
  const styles = status === 'ACTIVE'
    ? {
        background: 'var(--status-approval-approved-bg)',
        borderColor: 'var(--status-approval-approved-border)',
        color: 'var(--status-approval-approved-text)',
      }
    : status === 'PENDING'
      ? {
          background: 'var(--status-approval-pending-bg)',
          borderColor: 'var(--status-approval-pending-border)',
          color: 'var(--status-approval-pending-text)',
        }
      : {
          background: 'var(--status-approval-rejected-bg)',
          borderColor: 'var(--status-approval-rejected-border)',
          color: 'var(--status-approval-rejected-text)',
        };

  return (
    <span className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold" style={styles}>
      {status}
    </span>
  );
}

function ClubProfilePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const clubProfileQuery = useClubProfile(clubId);
  const memberships = useMemberships();
  const joinClub = useJoinClub();

  const club = clubProfileQuery.data?.club;
  const leadership = clubProfileQuery.data?.leadership ?? [];
  const recentEvents = clubProfileQuery.data?.recentEvents ?? [];
  const memberCount = clubProfileQuery.data?.memberCount ?? 0;
  const membership =
    (memberships.data.memberships ?? []).find(
      (item) => String(item.clubId ?? item.club?._id ?? '') === String(clubId),
    ) ?? null;

  if (clubProfileQuery.isLoading || memberships.isLoading) {
    return <div className="flex justify-center py-16"><Loader size="lg" /></div>;
  }

  if (!club) {
    return (
      <EmptyState
        description="This club profile could not be loaded."
        icon="clubs"
        title="Club not found"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Button onClick={() => navigate('/dashboard/clubs')} variant="ghost">
        Back to Clubs
      </Button>

      <section className="card-surface overflow-hidden">
        <div
          className="h-48 w-full"
          style={{
            background: club.logoUrl
              ? `url(${club.logoUrl}) center/cover no-repeat`
              : 'linear-gradient(135deg, var(--color-brand-soft), var(--color-surface-soft))',
          }}
        />
        <div className="space-y-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">{club.name}</h1>
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">
                  {club.type}
                </span>
              </div>
              {club.description ? (
                <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
                  {club.description}
                </p>
              ) : null}
              {(club.tags ?? []).length ? (
                <div className="flex flex-wrap gap-2">
                  {club.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-brand)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand)]">
                  <Icon className="h-5 w-5" name="memberships" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Members</p>
                  <p className="text-xl font-semibold text-[var(--color-text-primary)]">{memberCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Current Leadership</h2>
        {leadership.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leadership.map((item) => {
              const canonicalRole = formatCanonicalRole(item.canonicalRole);
              const subtitle =
                item.displayRoleName && item.displayRoleName !== canonicalRole
                  ? item.displayRoleName
                  : null;

              return (
                <article key={item._id} className="card-surface-muted flex items-start gap-4 p-4">
                  <Avatar name={subtitle || canonicalRole} size="lg" />
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">
                      {canonicalRole}
                    </p>
                    {subtitle ? (
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
                    ) : null}
                    <span className="mt-3 inline-flex rounded-full border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                      {item.scopeType}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            description="Leadership roles will appear here once assignments are made."
            icon="clubs"
            title="No roles assigned yet"
          />
        )}
      </section>

      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Recent Events</h2>
        {recentEvents.length ? (
          <div className="mt-5 space-y-3">
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Approved and closed events will appear here."
            icon="events"
            title="No recent events"
          />
        )}
      </section>

      {club.isActive ? (
        <section className="card-surface p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Join This Club</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Become part of the club to access member activities and updates.
          </p>
          <div className="mt-5">
            {membership ? (
              <MembershipBadge status={membership.status} />
            ) : (
              <Button isLoading={joinClub.isPending} onClick={() => joinClub.mutate({ clubId })}>
                Join Club
              </Button>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ClubProfilePage;
