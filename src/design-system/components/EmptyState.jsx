import Icon from '@dashboard/components/Icon';

function EmptyState({ icon = 'dashboard', title = 'Nothing here yet', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]">
        <Icon className="h-8 w-8" name={icon} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--color-text-secondary)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default EmptyState;
