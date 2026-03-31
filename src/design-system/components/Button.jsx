import Loader from '@ds/components/Loader';

const variantClasses = {
  primary:
    'bg-[var(--color-brand)] text-[var(--color-text-inverse)] hover:brightness-105 focus-visible:outline-[var(--color-brand)]',
  secondary:
    'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-[var(--color-brand)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] focus-visible:outline-[var(--color-brand)]',
};

const sizeClasses = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-5 text-base sm:px-6',
};

function Button({
  children,
  className = '',
  disabled = false,
  isLoading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={[
        'inline-flex min-w-0 items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      {isLoading ? <Loader color="currentColor" size="sm" /> : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
