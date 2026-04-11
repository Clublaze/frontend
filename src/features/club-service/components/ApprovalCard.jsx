import { approvalStatusColors } from '@ds/tokens';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { formatStatusLabel } from '@dashboard/utils/dashboardFormatters';

function ApprovalCard({ approval }) {
  const colors = approvalStatusColors[approval.status] ?? approvalStatusColors.PENDING;

  return (
    <article className="card-surface-muted flex items-start justify-between gap-4 p-4">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          {approval.eventTitle}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {approval.canonicalRoleLabel || formatCanonicalRole(approval.canonicalRole)} - Step {approval.stepOrder}
        </p>
      </div>

      <span
        style={{
          background: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
        }}
        className="rounded-full px-3 py-1 text-xs font-semibold"
      >
        {formatStatusLabel(approval.status || 'PENDING')}
      </span>
    </article>
  );
}

export default ApprovalCard;
