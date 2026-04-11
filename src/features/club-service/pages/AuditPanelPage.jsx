import { useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import AuditEntry from '@club/components/AuditEntry';
import { useAuditPanel } from '@club/hooks/useAuditPanel';
import { useIsAdmin, usePermission } from '@hooks/usePermission';

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

  if (!can('VIEW_AUDIT') && !can('VIEW_APPROVALS') && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const displayLogs = page === 1 ? (data?.logs ?? []) : [...allLogs, ...(data?.logs ?? [])];
  const hasMore = data ? page < data.totalPages : false;

  return (
    <div className="space-y-8">
      <PageHeader title="Audit Panel" description="Complete activity log of all platform actions." />

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {ACTION_FILTERS.map((filter) => (
          <Button
            key={filter.label}
            className={[
              'shrink-0 border px-3 py-1.5',
              activeFilter === filter.value
                ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]'
                : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
            ].join(' ')}
            onClick={() => handleFilterChange(filter.value)}
            size="sm"
            variant="ghost"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isLoading && page === 1 ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : displayLogs.length === 0 ? (
        <EmptyState
          icon="audit"
          title="No audit records"
          description="Activity will appear here as actions are taken on the platform."
        />
      ) : (
        <div className="card-surface p-5">
          <div className="space-y-0">
            {displayLogs.map((item) => (
              <AuditEntry key={item._id} item={item} />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-4 flex justify-center">
              <Button
                disabled={isFetching}
                onClick={handleLoadMore}
                size="sm"
                variant="ghost"
              >
                {isFetching ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AuditPanelPage;
