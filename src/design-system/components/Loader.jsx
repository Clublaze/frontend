function Loader({ className = '', color = 'var(--color-brand)', label, size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className={`inline-block animate-spin rounded-full border-solid border-transparent border-t-current ${sizeClasses[size]}`}
        style={{ color }}
      />
      {label ? <span className="text-sm text-[var(--color-text-secondary)]">{label}</span> : null}
    </div>
  );
}

export default Loader;
