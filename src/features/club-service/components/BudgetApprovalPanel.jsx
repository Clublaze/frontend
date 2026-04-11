import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '@ds/components/Button';
import StatusBadge from '@ds/components/StatusBadge';
import Textarea from '@ds/components/Textarea';
import { useApproveBudget, useRejectBudget } from '@club/hooks/useBudget';
import { formatDateTime } from '@dashboard/utils/dashboardFormatters';

const rejectionSchema = z.object({
  reason: z.string().min(10, 'Enter at least 10 characters').max(500, 'Maximum 500 characters'),
});

function BudgetApprovalPanel({ eventId, budget, canApproveBudget }) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const approveBudget = useApproveBudget();
  const rejectBudget = useRejectBudget();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      reason: '',
    },
    resolver: zodResolver(rejectionSchema),
  });

  const handleReject = ({ reason }) => {
    rejectBudget.mutate(
      { eventId, reason },
      {
        onSuccess: () => {
          setShowRejectForm(false);
          reset();
        },
      },
    );
  };

  return (
    <section className="card-surface-muted space-y-5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Budget Approval</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Review the submitted budget before the event moves forward.
          </p>
        </div>
        <StatusBadge status={budget.status} type="approval" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Proposed Expense</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            Rs. {budget.proposedExpense?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Sponsorship Amount</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            Rs. {budget.sponsorshipAmount?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Advance Required</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            Rs. {budget.advanceRequired?.toLocaleString() ?? 0}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <table className="min-w-full divide-y divide-[var(--color-border)]">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface-soft)]">
            {(budget.expenseBreakdown ?? []).map((item, index) => (
              <tr key={`${item.category}-${index}`}>
                <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{item.category}</td>
                <td className="px-4 py-3 text-right text-sm font-medium text-[var(--color-text-primary)]">
                  Rs. {item.amount?.toLocaleString() ?? 0}
                </td>
              </tr>
            ))}
            {!(budget.expenseBreakdown ?? []).length ? (
              <tr>
                <td className="px-4 py-4 text-sm text-[var(--color-text-secondary)]" colSpan="2">
                  No expense breakdown submitted.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {budget.status === 'SUBMITTED' && canApproveBudget ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              isLoading={approveBudget.isPending}
              onClick={() => approveBudget.mutate(eventId)}
              style={{ background: 'var(--color-success)', color: 'var(--color-text-on-brand)' }}
            >
              Approve Budget
            </Button>
            <Button onClick={() => setShowRejectForm((current) => !current)} variant="secondary">
              Reject Budget
            </Button>
          </div>

          {showRejectForm ? (
            <form className="space-y-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4" onSubmit={handleSubmit(handleReject)}>
              <Textarea
                error={errors.reason?.message}
                label="Rejection Reason"
                rows={4}
                {...register('reason')}
              />
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setShowRejectForm(false);
                    reset();
                  }}
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={rejectBudget.isPending}
                  style={{ background: 'var(--color-danger)', color: 'var(--color-text-on-brand)' }}
                  type="submit"
                >
                  Confirm Rejection
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      ) : null}

      {budget.status === 'APPROVED' ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--status-approval-approved-border)] bg-[var(--status-approval-approved-bg)] p-4">
          <p className="text-sm font-semibold text-[var(--status-approval-approved-text)]">
            Budget approved
          </p>
          <p className="mt-1 text-sm text-[var(--status-approval-approved-text)]">
            Approved on {formatDateTime(budget.approvedAt) || 'recorded recently'}.
          </p>
        </div>
      ) : null}

      {budget.status === 'REJECTED' && budget.rejectionReason ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[color-mix(in_srgb,var(--color-danger)_10%,var(--color-surface)_90%)] p-4">
          <p className="text-sm font-semibold text-[var(--color-danger)]">Budget rejected</p>
          <p className="mt-1 text-sm text-[var(--color-danger)]">{budget.rejectionReason}</p>
        </div>
      ) : null}
    </section>
  );
}

export default BudgetApprovalPanel;
