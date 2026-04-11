import { Link, useNavigate, useParams } from 'react-router-dom';
import Avatar from '@ds/components/Avatar';
import Button from '@ds/components/Button';
import EmptyState from '@ds/components/EmptyState';
import Loader from '@ds/components/Loader';
import EventCard from '@club/components/EventCard';
import { useSocietyProfile } from '@club/hooks/useSocietyProfile';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';

function SocietyProfilePage() {
  const { societyId } = useParams();
  const navigate = useNavigate();
  const societyProfileQuery = useSocietyProfile(societyId);

  const society = societyProfileQuery.data?.society;
  const leadership = societyProfileQuery.data?.leadership ?? [];
  const clubs = societyProfileQuery.data?.clubs ?? [];
  const recentEvents = societyProfileQuery.data?.recentEvents ?? [];

  if (societyProfileQuery.isLoading) {
    return <div className="flex justify-center py-16"><Loader size="lg" /></div>;
  }

  if (!society) {
    return (
      <EmptyState
        description="This society profile could not be loaded."
        icon="societies"
        title="Society not found"
      />
    );
  }

  return (
    <div className="space-y-8">
      <Button onClick={() => navigate('/dashboard/societies')} variant="ghost">
        Back to Societies
      </Button>

      <section className="card-surface overflow-hidden">
        <div
          className="h-48 w-full"
          style={{
            background: society.logoUrl
              ? `url(${society.logoUrl}) center/cover no-repeat`
              : 'linear-gradient(135deg, var(--color-brand-soft), var(--color-surface-soft))',
          }}
        />
        <div className="space-y-5 p-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-[var(--color-text-primary)]">{society.name}</h1>
            {society.description ? (
              <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)]">
                {society.description}
              </p>
            ) : null}
            {(society.tags ?? []).length ? (
              <div className="flex flex-wrap gap-2">
                {society.tags.map((tag) => (
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Clubs</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">{clubs.length}</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">Leadership Roles</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">{leadership.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Society Leadership</h2>
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
            icon="societies"
            title="No roles assigned yet"
          />
        )}
      </section>

      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Clubs</h2>
        {clubs.length ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {clubs.map((club) => (
              <Link
                key={club._id}
                className="card-surface-muted block p-4 transition-transform hover:-translate-y-0.5"
                to={`/dashboard/clubs/${club._id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">{club.name}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{club.type}</p>
                  </div>
                  <span
                    className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                    style={club.isActive
                      ? {
                          background: 'var(--status-approval-approved-bg)',
                          borderColor: 'var(--status-approval-approved-border)',
                          color: 'var(--status-approval-approved-text)',
                        }
                      : {
                          background: 'var(--status-approval-rejected-bg)',
                          borderColor: 'var(--status-approval-rejected-border)',
                          color: 'var(--status-approval-rejected-text)',
                        }}
                  >
                    {club.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Public clubs under this society will appear here."
            icon="clubs"
            title="No clubs available"
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
    </div>
  );
}

export default SocietyProfilePage;
