import { Link } from 'react-router-dom';
import GlowStat from '@ds/components/GlowStat';
import DashboardCard from '@dashboard/components/DashboardCard';
import EmptyState from '@ds/components/EmptyState';
import {
  formatDate,
  formatStatusLabel,
  formatTimeOnly,
} from '@dashboard/utils/dashboardFormatters';

function AdminDashboard({ dashboard }) {
  const { stats = {}, auditFeed = [] } = dashboard;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlowStat icon="societies" label="Societies" theme="brand" value={stats.societies ?? 0} />
        <GlowStat icon="clubs" label="Clubs" theme="success" value={stats.clubs ?? 0} />
        <GlowStat icon="approvals" label="Pending Approvals" theme="danger" value={stats.approvalsPending ?? 0} />
        <GlowStat icon="memberships" label="Total Members" theme="neutral" value={stats.organizationUnits ?? 0} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Active Users', value: stats.activeClubs ?? 0 },
          { label: 'Events This Month', value: stats.auditFeedItems ?? 0 },
          { label: 'Upcoming Events', value: stats.upcomingEvents ?? 0 },
        ].map((item) => (
          <div key={item.label} className="card-surface-muted p-6">
            <p className="text-3xl font-semibold text-[var(--color-text-primary)]">{item.value}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          icon="audit"
          title="Audit Trail"
          actionLabel={<Link to="/dashboard/audit" className="text-sm text-[var(--color-brand)]">View All →</Link>}
        >
          {auditFeed.length === 0
            ? <EmptyState icon="audit" title="No audit records" />
            : auditFeed.slice(0, 5).map((item) => (
              <div key={item._id} className="card-surface-muted mb-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {formatStatusLabel(item.action)}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                      {item.performedBy}{item.performedByRole ? ` (${item.performedByRole})` : ''} → {item.metadata?.eventTitle || item.entityType}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </div>
            ))}
        </DashboardCard>

        <DashboardCard icon="audit" title="Platform Activity">
          {auditFeed.length === 0
            ? <EmptyState icon="audit" title="No activity" />
            : auditFeed.slice(0, 6).map((item) => (
              <div key={item._id} className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 hover:bg-[var(--color-surface-soft)]">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatStatusLabel(item.action)}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {item.performedBy || 'System'}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[var(--color-text-secondary)]">
                  {formatTimeOnly(item.timestamp)}
                </span>
              </div>
            ))}
        </DashboardCard>
      </div>
    </div>
  );
}

export default AdminDashboard;
