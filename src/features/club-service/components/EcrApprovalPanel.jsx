import Button from '@ds/components/Button';
import StatusBadge from '@ds/components/StatusBadge';
import { useApproveEcr } from '@club/hooks/useEcr';
import { formatDateTime } from '@dashboard/utils/dashboardFormatters';

function EcrApprovalPanel({ eventId, ecr, canApproveEcr }) {
  const approveEcr = useApproveEcr();

  return (
    <section className="card-surface-muted space-y-5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">ECR Review</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Post-event reporting and outcomes for this event.
          </p>
        </div>
        <StatusBadge status={ecr.status} type="approval" />
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Actual Participants</p>
        <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
          {ecr.actualParticipants ?? 0}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Objectives Achieved</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            {ecr.objectivesAchieved || 'Not provided'}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Event Description</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            {ecr.eventDescription || 'Not provided'}
          </p>
        </div>
      </div>

      {ecr.lessonsLearned ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Lessons Learned</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{ecr.lessonsLearned}</p>
        </div>
      ) : null}

      {ecr.feedbackSummary ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Feedback Summary</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{ecr.feedbackSummary}</p>
        </div>
      ) : null}

      {ecr.status === 'SUBMITTED' && canApproveEcr ? (
        <Button
          isLoading={approveEcr.isPending}
          onClick={() => approveEcr.mutate(eventId)}
          style={{ background: 'var(--color-success)', color: 'var(--color-text-on-brand)' }}
        >
          Approve ECR
        </Button>
      ) : null}

      {ecr.status === 'APPROVED' ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--status-approval-approved-border)] bg-[var(--status-approval-approved-bg)] p-4">
          <p className="text-sm font-semibold text-[var(--status-approval-approved-text)]">ECR approved</p>
          <p className="mt-1 text-sm text-[var(--status-approval-approved-text)]">
            Approved on {formatDateTime(ecr.approvedAt) || 'recorded recently'}.
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default EcrApprovalPanel;
