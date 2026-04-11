import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import GlowStat from '@ds/components/GlowStat';
import EmptyState from '@ds/components/EmptyState';
import DashboardCard from '@dashboard/components/DashboardCard';
import Button from '@ds/components/Button';
import ApprovalCard from '@club/components/ApprovalCard';
import {
  formatStatusLabel,
  formatTimeOnly,
} from '@dashboard/utils/dashboardFormatters';

function ApproverDashboard({ dashboard }) {
  const navigate = useNavigate();
  const { stats = {}, approvalItems = [], auditFeed = [] } = dashboard;

  return (
    <div className="space-y-6">
      {approvalItems.length > 0 && (
        <div
          className="flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border p-4"
          style={{
            background: 'var(--status-approval-pending-bg)',
            borderColor: 'var(--status-approval-pending-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" style={{ color: 'var(--status-approval-pending-text)' }} />
            <div>
              <p className="font-semibold" style={{ color: 'var(--status-approval-pending-text)' }}>
                You have {approvalItems.length} approval{approvalItems.length !== 1 ? 's' : ''} pending
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Review and take action on these events
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/approvals')}>
            Review All
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <GlowStat icon="approvals" label="Pending Approvals" theme="brand" value={stats.approvalsPending ?? 0} />
        <GlowStat icon="events" label="Reviewed Today" theme="neutral" value={0} />
        <GlowStat icon="events" label="Total Events" theme="success" value={stats.createdEvents ?? 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          icon="approvals"
          title="Pending Your Approval"
          actionLabel={<Link to="/dashboard/approvals" className="text-sm text-[var(--color-brand)]">View All →</Link>}
        >
          {approvalItems.length === 0
            ? <EmptyState icon="approvals" title="No pending approvals" />
            : approvalItems.slice(0, 4).map((item) => (
              <ApprovalCard key={item._id} approval={item} />
            ))}
        </DashboardCard>

        <DashboardCard icon="audit" title="Recent Activity">
          {auditFeed.length === 0
            ? <EmptyState icon="audit" title="No recent activity" />
            : auditFeed.slice(0, 6).map((item) => (
              <div key={item._id} className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 hover:bg-[var(--color-surface-soft)]">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatStatusLabel(item.action)}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    {item.performedByRole || item.performedBy} · {item.metadata?.eventTitle || item.entityType}
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

export default ApproverDashboard;
