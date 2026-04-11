import DashboardCard from '@dashboard/components/DashboardCard';
import { formatDate, formatStatusLabel } from '@dashboard/utils/dashboardFormatters';

function AuditSection({ feed = [] }) {
  const compactTime = (value) =>
    new Date(value).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <DashboardCard actionLabel="View All" icon="audit" title="Audit Trail">
        <div className="space-y-3">
          {feed.length ? (
            feed.map((item) => (
              <article className="card-surface-muted p-4" key={item._id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                      {formatStatusLabel(item.action)}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {(item.performedByRole || 'Unknown role')} - {item.metadata?.eventTitle || item.entityType}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-[var(--color-text-secondary)]">
                    {formatDate(item.timestamp)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No audit records found.
            </p>
          )}
        </div>
      </DashboardCard>

      <DashboardCard icon="audit" title="Platform Activity">
        <div className="space-y-3">
          {feed.length ? (
            feed.map((item) => (
              <article className="card-surface-muted p-4" key={item._id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                      {formatStatusLabel(item.action)}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {item.performedBy || 'Unknown user'}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-[var(--color-text-secondary)]">
                    {compactTime(item.timestamp)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No audit records found.
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}

export default AuditSection;
