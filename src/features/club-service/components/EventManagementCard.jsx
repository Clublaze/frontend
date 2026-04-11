import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@ds/components/Button';
import StatusBadge from '@ds/components/StatusBadge';
import BudgetForm from '@club/components/BudgetForm';
import EcrForm from '@club/components/EcrForm';
import SettlementForm from '@club/components/SettlementForm';
import {
  useMarkEventComplete,
  useResubmitEvent,
  useSubmitEvent,
} from '@club/hooks/useEventActions';
import { useBudget } from '@club/hooks/useBudget';
import { formatDate } from '@dashboard/utils/dashboardFormatters';

const CATEGORY_COLORS = {
  COMPETITION: 'bg-[var(--status-event-review-bg)] text-[var(--status-event-review-text)]',
  HACKATHON: 'bg-[var(--color-brand-soft)] text-[var(--color-brand)]',
  SEMINAR: 'bg-[var(--status-event-ecr-bg)] text-[var(--status-event-ecr-text)]',
  WORKSHOP: 'bg-[var(--status-event-draft-bg)] text-[var(--status-event-draft-text)]',
};

function CategoryBadge({ category }) {
  const colorClass = CATEGORY_COLORS[category] ?? 'bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]';

  return (
    <span className={['rounded-full px-2 py-0.5 text-xs font-semibold', colorClass].join(' ')}>
      {category?.replace(/_/g, ' ') ?? 'Event'}
    </span>
  );
}

function EventManagementCard({ event }) {
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [ecrOpen, setEcrOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);

  const submitEvent = useSubmitEvent();
  const resubmitEvent = useResubmitEvent();
  const markComplete = useMarkEventComplete();
  const budgetQuery = useBudget(
    ['DRAFT', 'UNDER_REVIEW', 'REJECTED'].includes(event.status) ? event._id : null,
  );

  const budget = budgetQuery.data;
  const budgetReady = budget?.status === 'SUBMITTED' || budget?.status === 'APPROVED';
  const canSubmitEvent = event.status === 'DRAFT' && budgetReady;
  const progressText = event.currentStep && event.totalSteps
    ? `Step ${event.currentStep} of ${event.totalSteps}`
    : 'Approval in progress';

  return (
    <article className="card-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={event.category} />
            <StatusBadge status={event.status} type="event" />
          </div>
          <h3 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
            <Link className="hover:text-[var(--color-brand)]" to={`/dashboard/events/${event._id}`}>
              {event.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {formatDate(event.startDate)}
            {event.venue ? ` - ${event.venue}` : ''}
            {event.clubName ? ` - ${event.clubName}` : ''}
          </p>
        </div>
      </div>

      {event.status === 'UNDER_REVIEW' ? (
        <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3 text-sm text-[var(--color-text-secondary)]">
          {progressText}
        </div>
      ) : null}

      {event.status === 'REJECTED' && event.rejectionReason ? (
        <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--status-event-rejected-border)] bg-[var(--status-event-rejected-bg)] p-3">
          <p className="text-sm text-[var(--status-event-rejected-text)]">
            <span className="font-semibold">Rejected: </span>{event.rejectionReason}
          </p>
        </div>
      ) : null}

      {event.status === 'DRAFT' ? (
        <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3 text-sm text-[var(--color-text-secondary)]">
          Budget:{' '}
          {!budget ? (
            <span className="text-[var(--color-danger)]">Not submitted yet</span>
          ) : (
            <span className={budgetReady ? 'text-[var(--color-success)]' : 'text-[var(--status-event-review-text)]'}>
              {budget.status} - Rs. {budget.proposedExpense?.toLocaleString()}
            </span>
          )}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link to={`/dashboard/events/${event._id}`}>
          <Button size="sm" variant="ghost">View Details</Button>
        </Link>
        {event.status === 'DRAFT' ? (
          <>
            <Button size="sm" variant="secondary" onClick={() => setBudgetOpen(true)}>
              {budget ? 'Edit Budget' : 'Submit Budget'}
            </Button>
            <Button
              size="sm"
              disabled={!canSubmitEvent}
              isLoading={submitEvent.isPending}
              onClick={() => submitEvent.mutate(event._id)}
              title={!canSubmitEvent ? 'Submit budget first' : undefined}
            >
              Submit for Approval
            </Button>
          </>
        ) : null}

        {event.status === 'REJECTED' ? (
          <Button
            size="sm"
            isLoading={resubmitEvent.isPending}
            onClick={() => resubmitEvent.mutate(event._id)}
          >
            Resubmit
          </Button>
        ) : null}

        {event.status === 'APPROVED' ? (
          <Button
            size="sm"
            isLoading={markComplete.isPending}
            onClick={() => markComplete.mutate(event._id)}
          >
            Mark as Complete
          </Button>
        ) : null}

        {event.status === 'ECR_PENDING' ? (
          <>
            <Button size="sm" variant="secondary" onClick={() => setEcrOpen(true)}>
              Submit ECR
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setSettlementOpen(true)}>
              Submit Settlement
            </Button>
          </>
        ) : null}
      </div>

      <BudgetForm
        open={budgetOpen}
        onClose={() => setBudgetOpen(false)}
        eventId={event._id}
        existingBudget={budget}
      />
      <EcrForm
        open={ecrOpen}
        onClose={() => setEcrOpen(false)}
        eventId={event._id}
      />
      <SettlementForm
        open={settlementOpen}
        onClose={() => setSettlementOpen(false)}
        eventId={event._id}
      />
    </article>
  );
}

export default EventManagementCard;
