function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
      {children}
    </p>
  );
}

export default SectionLabel;
