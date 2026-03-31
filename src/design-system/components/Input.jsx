import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { className = '', error, helperText, label, ...props },
  ref,
) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      ) : null}

      <input
        ref={ref}
        className={[
          'min-h-12 w-full rounded-[var(--radius-md)] border bg-[var(--color-surface-soft)] px-4 py-3 text-base text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)] sm:text-sm',
          error
            ? 'border-[var(--color-danger)] focus:[box-shadow:0_0_0_4px_var(--color-brand-soft)]'
            : 'border-[var(--color-border)] focus:[box-shadow:0_0_0_4px_var(--color-brand-soft)]',
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

export default Input;
