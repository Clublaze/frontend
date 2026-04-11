import { Link } from 'react-router-dom';

function ListRow({ title, subtitle, badge, rightText, href, onClick }) {
  const content = (
    <div className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-[var(--color-surface-soft)]">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {badge ? (
          <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-brand)]">
            {badge}
          </span>
        ) : null}
        {rightText ? (
          <span className="text-xs text-[var(--color-text-secondary)]">{rightText}</span>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className="w-full text-left" onClick={onClick} type="button">
      {content}
    </button>
  );
}

export default ListRow;
