import { useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Modal from '@ds/components/Modal';
import Button from '@ds/components/Button';
import StatusBadge from '@ds/components/StatusBadge';
import Textarea from '@ds/components/Textarea';
import { useApprovals } from '@club/hooks/useApprovals';
import { useApproveStep, useRejectStep } from '@club/hooks/useApprovalActions';
import { useApproveBudget, useBudget, useRejectBudget } from '@club/hooks/useBudget';
import { getEventById } from '@club/api/events.api';
import { useIsAdmin, usePermission } from '@hooks/usePermission';
import { formatDate } from '@dashboard/utils/dashboardFormatters';

const rejectSchema = z.object({
  reason: z.string().min(10, 'Please provide at least 10 characters.').max(500),
});

function BudgetApprovalRow({ canApproveBudget, eventId }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const budgetQuery = useBudget(eventId);
  const approveBudget = useApproveBudget();
  const rejectBudget = useRejectBudget();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(rejectSchema),
  });

  const budget = budgetQuery.data;
  if (!canApproveBudget || !budget || budget.status !== 'SUBMITTED') return null;

  const onRejectBudget = ({ reason }) => {
    rejectBudget.mutate(
      { eventId, reason },
      { onSuccess: () => { setRejectOpen(false); reset(); } },
    );
  };

  return (
    <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Budget: Rs. {budget.proposedExpense?.toLocaleString()} - SUBMITTED
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Advance required: Rs. {budget.advanceRequired?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={approveBudget.isPending}
            onClick={() => approveBudget.mutate(eventId)}
            style={{
              background: 'var(--color-success)',
              color: 'var(--color-text-inverse)',
            }}
          >
            Approve Budget
          </Button>
          <Button
            size="sm"
            onClick={() => setRejectOpen(true)}
            style={{
              background: 'var(--color-danger)',
              color: 'var(--color-text-on-brand)',
            }}
          >
            Reject Budget
          </Button>
        </div>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => { setRejectOpen(false); reset(); }}
        title="Reject Budget"
      >
        <form onSubmit={handleSubmit(onRejectBudget)} className="space-y-4">
          <Textarea
            label="Reason"
            rows={4}
            placeholder="Explain why this budget is being rejected..."
            error={errors.reason?.message}
            {...register('reason')}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => { setRejectOpen(false); reset(); }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={rejectBudget.isPending}
              style={{
                background: 'var(--color-danger)',
                color: 'var(--color-text-on-brand)',
              }}
            >
              Reject Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ApprovalsPage() {
  const dashboard = useOutletContext() ?? {};
  const { can } = usePermission(dashboard.roles ?? []);
  const isAdmin = useIsAdmin();
  const [rejectTarget, setRejectTarget] = useState(null);
  const approveStep = useApproveStep();
  const rejectStep = useRejectStep();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(rejectSchema),
  });

  const { data: approvalItems, isLoading } = useApprovals({
    enabled: can('APPROVE_STEP') || isAdmin,
  });

  const eventQueries = useQueries({
    queries: (approvalItems ?? []).map((step) => ({
      enabled: !!step.eventId,
      queryFn: () => getEventById(step.eventId),
      queryKey: ['club-service', 'events', step.eventId],
    })),
  });

  if (!can('APPROVE_STEP') && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const onRejectSubmit = ({ reason }) => {
    rejectStep.mutate(
      { reason, stepId: rejectTarget.stepId },
      { onSuccess: () => { setRejectTarget(null); reset(); } },
    );
  };

  const items = approvalItems ?? [];
  const canApproveBudget = can('APPROVE_BUDGET') || isAdmin;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Approval Dashboard"
        description="Review and take action on events assigned to you."
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="approvals"
          title="No pending approvals"
          description="You have no approval steps assigned right now."
        />
      ) : (
        <>
          <div
            className="rounded-[var(--radius-lg)] border p-4"
            style={{
              background: 'var(--status-approval-pending-bg)',
              borderColor: 'var(--status-approval-pending-border)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl text-[var(--status-approval-pending-text)]">!</span>
              <div>
                <p className="font-semibold text-[var(--status-approval-pending-text)]">
                  You have {items.length} approval{items.length !== 1 ? 's' : ''} pending
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  These events require your immediate review.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {items.map((step, index) => {
              const event = eventQueries[index]?.data;
              const docCount = event?.attachments
                ? Object.values(event.attachments).filter((value) => value && typeof value === 'string').length
                : 0;

              return (
                <article key={step._id} className="card-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={step.status ?? 'PENDING'} type="approval" />
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          Step: {step.canonicalRoleLabel ?? step.canonicalRole}
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                        {step.eventTitle}
                      </h3>

                      {event?.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                          {event.description}
                        </p>
                      ) : null}

                      {event ? (
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                          <span>Date: {formatDate(event.startDate)}</span>
                          {event.venue ? <span>Venue: {event.venue}</span> : null}
                          {event.expectedParticipants ? (
                            <span>{event.expectedParticipants} participants</span>
                          ) : null}
                          <span>{docCount} document{docCount !== 1 ? 's' : ''}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <Button
                        disabled={approveStep.isPending}
                        onClick={() => approveStep.mutate({ stepId: step._id })}
                        style={{
                          background: 'var(--color-success)',
                          color: 'var(--color-text-inverse)',
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => setRejectTarget({ stepId: step._id })}
                        style={{
                          background: 'var(--color-danger)',
                          color: 'var(--color-text-on-brand)',
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  <BudgetApprovalRow
                    canApproveBudget={canApproveBudget}
                    eventId={step.eventId}
                  />
                </article>
              );
            })}
          </div>
        </>
      )}

      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); reset(); }}
        title="Reject Event"
      >
        <form onSubmit={handleSubmit(onRejectSubmit)} className="space-y-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Provide a clear reason. The organiser will see this message.
          </p>
          <div>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Reason</span>
              <textarea
                className="min-h-28 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
                placeholder="Explain why this event is being rejected..."
                {...register('reason')}
              />
              {errors.reason ? (
                <p className="text-sm text-[var(--color-danger)]">{errors.reason.message}</p>
              ) : null}
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => { setRejectTarget(null); reset(); }}
            >
              Cancel
            </Button>
            <Button
              isLoading={rejectStep.isPending}
              type="submit"
              style={{
                background: 'var(--color-danger)',
                color: 'var(--color-text-on-brand)',
              }}
            >
              Reject Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ApprovalsPage;
