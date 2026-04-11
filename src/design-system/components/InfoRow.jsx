function InfoRow({ label, value, className = '' }) {
  if (!value) return null;

  return (
    <div className={['flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4', className].join(' ')}>
      <span className="w-36 shrink-0 text-sm text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-sm font-medium text-[var(--color-text-primary)]">{value}</span>
    </div>
  );
}

export default InfoRow;
