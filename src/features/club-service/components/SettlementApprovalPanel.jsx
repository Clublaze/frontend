import Button from '@ds/components/Button';
import StatusBadge from '@ds/components/StatusBadge';
import { useApproveSettlement } from '@club/hooks/useBudget';
import { formatDateTime } from '@dashboard/utils/dashboardFormatters';

function SettlementApprovalPanel({ eventId, settlement, canApproveSettlement }) {
  const approveSettlement = useApproveSettlement();

  return (
    <section className="card-surface-muted space-y-5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Settlement Review</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Review the final settlement before closing the event finances.
          </p>
        </div>
        <StatusBadge status={settlement.status} type="approval" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Actual Expense</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            Rs. {settlement.actualExpense?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Actual Income</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            Rs. {settlement.actualIncome?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">Advance Settlement</p>
          <p className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            Rs. {settlement.advanceSettlement?.toLocaleString() ?? 0}
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
            {(settlement.expenseBreakdown ?? []).map((item, index) => (
              <tr key={`${item.category}-${index}`}>
                <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">{item.category}</td>
                <td className="px-4 py-3 text-right text-sm font-medium text-[var(--color-text-primary)]">
                  Rs. {item.amount?.toLocaleString() ?? 0}
                </td>
              </tr>
            ))}
            {!(settlement.expenseBreakdown ?? []).length ? (
              <tr>
                <td className="px-4 py-4 text-sm text-[var(--color-text-secondary)]" colSpan="2">
                  No expense breakdown submitted.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {settlement.notes ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">Notes</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{settlement.notes}</p>
        </div>
      ) : null}

      {settlement.status === 'UNDER_REVIEW' && canApproveSettlement ? (
        <Button
          isLoading={approveSettlement.isPending}
          onClick={() => approveSettlement.mutate(eventId)}
          style={{ background: 'var(--color-success)', color: 'var(--color-text-on-brand)' }}
        >
          Approve Settlement
        </Button>
      ) : null}

      {settlement.status === 'APPROVED' ? (
        <div className="rounded-[var(--radius-md)] border border-[var(--status-approval-approved-border)] bg-[var(--status-approval-approved-bg)] p-4">
          <p className="text-sm font-semibold text-[var(--status-approval-approved-text)]">
            Settlement approved
          </p>
          <p className="mt-1 text-sm text-[var(--status-approval-approved-text)]">
            Approved on {formatDateTime(settlement.approvedAt) || 'recorded recently'}.
          </p>
        </div>
      ) : null}
    </section>
  );
}

export default SettlementApprovalPanel;
