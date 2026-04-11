import { useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import {
  CheckCircle,
  Plus,
  Search,
  Send,
  Users,
  XCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import { exportAuditCsv } from '@club/api/audit.api';
import { useAuditPanel } from '@club/hooks/useAuditPanel';
import { useIsAdmin, usePermission } from '@hooks/usePermission';
import {
  formatDateTime,
  formatStatusLabel,
} from '@dashboard/utils/dashboardFormatters';

const ACTION_FILTERS = [
  { label: 'All', value: null },
  { label: 'Event Approved', value: 'EVENT_APPROVED' },
  { label: 'Event Submitted', value: 'EVENT_SUBMITTED' },
  { label: 'Member Approved', value: 'MEMBERSHIP_APPROVED' },
  { label: 'Event Rejected', value: 'EVENT_REJECTED' },
  { label: 'Event Created', value: 'EVENT_CREATED' },
  { label: 'Budget Submitted', value: 'BUDGET_SUBMITTED' },
  { label: 'Member Rejected', value: 'MEMBERSHIP_REJECTED' },
];

function AuditPanelPage() {
  const dashboard = useOutletContext() ?? {};
  const { can } = usePermission(dashboard.roles ?? []);
  const isAdmin = useIsAdmin();
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [allLogs, setAllLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, isFetching } = useAuditPanel({ action: activeFilter, page });

  const handleLoadMore = () => {
    if (data?.logs) {
      setAllLogs((previous) => [...previous, ...data.logs]);
      setPage((current) => current + 1);
    }
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setPage(1);
    setAllLogs([]);
  };

  const handleExport = async () => {
    if (!fromDate || !toDate) {
      toast.error('Select both from and to dates');
      return;
    }

    setExporting(true);

    try {
      const blob = await exportAuditCsv({ from: fromDate, to: toDate });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `audit-${fromDate}-to-${toDate}.csv`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      toast.success('Audit log exported successfully.');
    } catch {
      toast.error('Export failed. Try again.');
    } finally {
      setExporting(false);
    }
  };

  if (!can('VIEW_AUDIT') && !can('VIEW_APPROVALS') && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const displayLogs = page === 1 ? (data?.logs ?? []) : [...allLogs, ...(data?.logs ?? [])];
  const filteredLogs = displayLogs.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.action ?? '').toLowerCase().includes(q) ||
      (item.performedBy ?? '').toLowerCase().includes(q) ||
      (item.performedByRole ?? '').toLowerCase().includes(q) ||
      (item.metadata?.eventTitle ?? '').toLowerCase().includes(q)
    );
  });
  const hasMore = data ? page < data.totalPages : false;

  return (
    <div className="space-y-8">
      <PageHeader title="Audit Panel" description="Complete activity log of all platform actions." />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            className="min-h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] pl-9 pr-4 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)]"
            placeholder="Search actions or people..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ACTION_FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              style={activeFilter === filter.value
                ? { background: 'var(--color-brand-soft)', color: 'var(--color-brand)', borderColor: 'var(--color-brand)' }
                : { background: 'var(--color-surface)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }
              }
              onClick={() => handleFilterChange(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {isAdmin || can('VIEW_AUDIT') ? (
        <section className="card-surface p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">From</span>
              <input
                className="min-h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
                onChange={(event) => setFromDate(event.target.value)}
                type="date"
                value={fromDate}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">To</span>
              <input
                className="min-h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
                onChange={(event) => setToDate(event.target.value)}
                type="date"
                value={toDate}
              />
            </label>
            <Button isLoading={exporting} onClick={handleExport} size="sm" variant="secondary">
              Export CSV
            </Button>
          </div>
        </section>
      ) : null}

      {isLoading && page === 1 ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon="audit"
          title="No audit records"
          description="Activity will appear here as actions are taken on the platform."
        />
      ) : (
        <div className="card-surface p-5">
          <div>
            {filteredLogs.map((item, idx) => {
              const isApproved = item.action?.includes('APPROVED');
              const isRejected = item.action?.includes('REJECTED');
              const isSubmitted = item.action?.includes('SUBMITTED');
              const isCreated = item.action?.includes('CREATED');
              const isMember = item.action?.includes('MEMBER') || item.action?.includes('MEMBERSHIP');

              const dotColor = isApproved ? 'var(--color-success)'
                : isRejected ? 'var(--color-danger)'
                : 'var(--color-brand)';

              const ActionIcon = isApproved ? CheckCircle
                : isRejected ? XCircle
                : isSubmitted ? Send
                : isCreated || isMember ? Plus
                : Users;

              const actor = item.performedByRole
                ? `${item.performedBy} (${item.performedByRole})`
                : item.performedBy || 'System';

              const entity = item.metadata?.eventTitle || item.entityType || '';

              return (
                <div key={item._id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full"
                      style={{ background: dotColor }}
                    />
                    {idx < filteredLogs.length - 1 && (
                      <span className="w-px flex-1 bg-[var(--color-border)]" />
                    )}
                  </div>

                  <article className="pb-6 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ActionIcon
                          className="h-4 w-4 shrink-0"
                          style={{ color: dotColor }}
                        />
                        <p
                          className="text-base font-semibold"
                          style={{ color: dotColor }}
                        >
                          {formatStatusLabel(item.action)}
                        </p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-xs text-[var(--color-text-secondary)]">
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      <strong className="font-medium text-[var(--color-text-primary)]">{actor}</strong>
                      {entity ? ` - ${entity}` : ''}
                    </p>

                    {(item.metadata?.reason || item.metadata?.comments) && (
                      <p className="mt-1 text-sm italic text-[var(--color-text-secondary)]">
                        {item.metadata.reason || item.metadata.comments}
                      </p>
                    )}
                  </article>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <Button disabled={isFetching} onClick={handleLoadMore} size="sm" variant="ghost">
                {isFetching ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AuditPanelPage;
