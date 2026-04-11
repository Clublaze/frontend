import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { className = '', error, helperText, label, rows = 4, ...props },
  ref,
) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      ) : null}
      <textarea
        ref={ref}
        rows={rows}
        className={[
          'w-full resize-none rounded-[var(--radius-md)] border bg-[var(--color-surface-soft)] px-4 py-3',
          'text-base text-[var(--color-text-primary)] outline-none transition-all duration-200',
          'placeholder:text-[var(--color-text-secondary)] sm:text-sm',
          error
            ? 'border-[var(--color-danger)]'
            : 'border-[var(--color-border)] focus:border-[var(--color-brand)]',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? (
        <p className="text-sm text-[var(--color-danger)]">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-[var(--color-text-secondary)]">{helperText}</p>
      ) : null}
    </label>
  );
});

export default Textarea;
