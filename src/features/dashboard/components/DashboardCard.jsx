import Icon from '@dashboard/components/Icon';

function DashboardCard({
  actionLabel,
  children,
  className = '',
  icon,
  title,
}) {
  return (
    <section
      className={[
        'card-surface flex h-full flex-col gap-5 p-5 sm:p-6',
        className,
      ].join(' ')}
    >
      {title ? (
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {icon ? (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-brand)]">
                <Icon className="h-5 w-5" name={icon} />
              </span>
            ) : null}
            <h2 className="truncate text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h2>
          </div>

          {actionLabel ? (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
              {actionLabel}
              <Icon className="h-4 w-4" name="arrowRight" />
            </span>
          ) : null}
        </header>
      ) : null}

      {children}
    </section>
  );
}

export default DashboardCard;
