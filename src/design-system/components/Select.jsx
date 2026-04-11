import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { className = '', error, helperText, label, children, ...props },
  ref,
) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      ) : null}
      <select
        ref={ref}
        className={[
          'min-h-12 w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-soft)] px-4 py-3',
          'text-base text-[var(--color-text-primary)] outline-none transition-all duration-200 sm:text-sm',
          error
            ? 'border-[var(--color-danger)]'
            : 'border-[var(--color-border)] focus:border-[var(--color-brand)]',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-[var(--color-text-secondary)]">{helperText}</p>
      ) : null}
    </label>
  );
});

export default Select;
