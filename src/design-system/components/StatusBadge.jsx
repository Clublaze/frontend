import { approvalStatusColors, eventStatusColors } from '@ds/tokens';

function StatusBadge({ status, type = 'event' }) {
  const map = type === 'approval' ? approvalStatusColors : eventStatusColors;
  const colors = map[status] ?? {
    bg: 'var(--color-surface-soft)',
    text: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
  };

  const label = (status ?? 'UNKNOWN')
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
