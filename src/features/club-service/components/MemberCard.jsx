import { formatDate, formatStatusLabel } from '@dashboard/utils/dashboardFormatters';

function MemberCard({ membership }) {
  const clubName = membership.club?.name ?? 'Club';
  const clubType = membership.club?.type ?? 'CLUB';
  const dateValue = membership.appliedAt ?? membership.createdAt;

  return (
    <article className="card-surface-muted flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-[var(--color-text-primary)]">
          {clubName}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {clubType} - {formatDate(dateValue)}
        </p>
      </div>

      <span className="shrink-0 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-brand)]">
        {formatStatusLabel(membership.status)}
      </span>
    </article>
  );
}

export default MemberCard;
