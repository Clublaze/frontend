import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import StatusBadge from '@ds/components/StatusBadge';
import { getApprovalHistory } from '@club/api/approvals.api';
import { getEventById } from '@club/api/events.api';
import { useBudget, useSettlement } from '@club/hooks/useBudget';
import { useEcr } from '@club/hooks/useEcr';
import { formatDate } from '@dashboard/utils/dashboardFormatters';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';

function TimelineStep({ item, index }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-sm font-semibold text-[var(--color-brand)]">
          {index + 1}
        </span>
        <span className="mt-2 w-px flex-1 bg-[var(--color-border)]" />
      </div>
      <div className="pb-6">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {formatCanonicalRole(item.canonicalRole)}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Status: {item.status ?? 'PENDING'}
        </p>
        {item.comments ? (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{item.comments}</p>
        ) : null}
      </div>
    </div>
  );
}

function EventDetailPage() {
  const { eventId } = useParams();
  const eventQuery = useQuery({
    queryKey: ['club-service', 'events', 'detail', eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  });
  const historyQuery = useQuery({
    queryKey: ['club-service', 'approvals', 'history', eventId],
    queryFn: () => getApprovalHistory(eventId),
    enabled: !!eventId,
  });
  const budgetQuery = useBudget(eventId);
  const ecrQuery = useEcr(eventId);
  const settlementQuery = useSettlement(eventId);

  const event = eventQuery.data;
  const approvalHistory = historyQuery.data ?? [];
  const isLoading =
    eventQuery.isLoading ||
    historyQuery.isLoading ||
    budgetQuery.isLoading ||
    ecrQuery.isLoading ||
    settlementQuery.isLoading;

  if (isLoading) {
    return <div className="flex justify-center py-16"><Loader size="lg" /></div>;
  }

  if (!event) {
    return <EmptyState icon="events" title="Event not found" description="This event could not be loaded." />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={event.title}
        description="Full event details, workflow progress, and post-event records."
      />

      <section className="card-surface overflow-hidden">
        <div
          className="h-56 w-full"
          style={{
            background: event.attachments?.poster
              ? `url(${event.attachments.poster}) center/cover no-repeat`
              : 'linear-gradient(135deg, var(--color-brand-soft) 0%, var(--color-surface-soft) 100%)',
          }}
        />
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={event.status} type="event" />
            {event.category ? (
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                {event.category.replace(/_/g, ' ')}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {formatDate(event.startDate)}{event.venue ? ` - ${event.venue}` : ''}{event.clubName ? ` - ${event.clubName}` : ''}
          </p>
          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">{event.description}</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="card-surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Objective</p>
              <p className="mt-2 text-sm text-[var(--color-text-primary)]">{event.objective ?? 'Not available'}</p>
            </div>
            <div className="card-surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Budget</p>
              <p className="mt-2 text-sm text-[var(--color-text-primary)]">
                {budgetQuery.data ? `Rs. ${budgetQuery.data.proposedExpense?.toLocaleString()} - ${budgetQuery.data.status}` : 'Not submitted'}
              </p>
            </div>
            <div className="card-surface-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Post Event</p>
              <p className="mt-2 text-sm text-[var(--color-text-primary)]">
                {ecrQuery.data ? `ECR ${ecrQuery.data.status ?? 'submitted'}` : 'No ECR yet'}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {settlementQuery.data ? `Settlement ${settlementQuery.data.status ?? 'submitted'}` : 'No settlement yet'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Approval Workflow Timeline</h2>
        <div className="mt-5">
          {approvalHistory.length ? (
            approvalHistory.map((item, index) => (
              <TimelineStep key={item._id ?? `${item.canonicalRole}-${index}`} item={item} index={index} />
            ))
          ) : (
            <EmptyState icon="approvals" title="No approval history yet" description="Approval steps will appear here once the event enters the workflow." />
          )}
        </div>
      </section>
    </div>
  );
}

export default EventDetailPage;
