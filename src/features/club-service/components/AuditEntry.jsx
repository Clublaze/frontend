import { formatDate, formatStatusLabel } from '@dashboard/utils/dashboardFormatters';

const ACTION_DOT_COLOR = {
  APPROVED: 'bg-[var(--color-success)]',
  CREATED: 'bg-[var(--color-brand)]',
  REJECTED: 'bg-[var(--color-danger)]',
  SUBMITTED: 'bg-[var(--color-brand)]',
};

function getDotColor(action = '') {
  const key = Object.keys(ACTION_DOT_COLOR).find((dotKey) => action.includes(dotKey));
  return ACTION_DOT_COLOR[key] ?? 'bg-[var(--color-text-secondary)]';
}

function AuditEntry({ item }) {
  const dotColor = getDotColor(item.action);
  const actionLabel = formatStatusLabel(item.action);
  const entityLabel = item.metadata?.eventTitle || item.entityType || '';
  const actor = item.performedByRole || (item.performedBy === 'SYSTEM' ? 'System' : item.performedBy);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${dotColor}`} />
        <span className="w-px flex-1 bg-[var(--color-border)]" />
      </div>
      <article className="pb-6">
        <p className="text-base font-semibold text-[var(--color-text-primary)]">
          {actionLabel}
        </p>
        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
          {actor}{entityLabel ? ` -> ${entityLabel}` : ''}
        </p>
        {item.metadata?.reason ? (
          <p className="mt-1 text-sm text-[var(--color-danger)]">{item.metadata.reason}</p>
        ) : null}
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          {formatDate(item.timestamp)}
        </p>
      </article>
    </div>
  );
}

export default AuditEntry;
