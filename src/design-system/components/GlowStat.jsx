import Icon from '@dashboard/components/Icon';

const statThemes = {
  brand: {
    accent: 'var(--color-brand)',
    background: 'color-mix(in srgb, var(--color-brand) 8%, var(--color-surface) 92%)',
    border: 'color-mix(in srgb, var(--color-brand) 22%, var(--color-border) 78%)',
    glow: 'color-mix(in srgb, var(--color-brand) 25%, transparent)',
  },
  success: {
    accent: 'var(--color-success)',
    background: 'color-mix(in srgb, var(--color-success) 8%, var(--color-surface) 92%)',
    border: 'color-mix(in srgb, var(--color-success) 20%, var(--color-border) 80%)',
    glow: 'color-mix(in srgb, var(--color-success) 24%, transparent)',
  },
  neutral: {
    accent: 'var(--color-text-primary)',
    background: 'color-mix(in srgb, var(--color-text-primary) 4%, var(--color-surface) 96%)',
    border: 'color-mix(in srgb, var(--color-text-primary) 16%, var(--color-border) 84%)',
    glow: 'color-mix(in srgb, var(--color-text-primary) 12%, transparent)',
  },
  danger: {
    accent: 'var(--color-danger)',
    background: 'color-mix(in srgb, var(--color-danger) 8%, var(--color-surface) 92%)',
    border: 'color-mix(in srgb, var(--color-danger) 20%, var(--color-border) 80%)',
    glow: 'color-mix(in srgb, var(--color-danger) 24%, transparent)',
  },
};

function GlowStat({ icon = 'dashboard', label, theme = 'brand', value }) {
  const colors = statThemes[theme] ?? statThemes.brand;

  return (
    <article
      className="relative overflow-hidden rounded-[var(--radius-xl)] border p-5 sm:p-6"
      style={{
        background: colors.background,
        borderColor: colors.border,
        boxShadow: `0 12px 36px -24px ${colors.glow}`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl"
        style={{ background: colors.glow, transform: 'translate(30%,-20%)' }}
      />
      <div className="relative flex items-center gap-4">
        <span
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)]"
          style={{
            background: 'color-mix(in srgb, var(--color-surface) 70%, transparent)',
            color: colors.accent,
          }}
        >
          <Icon className="h-6 w-6" name={icon} />
        </span>
        <div>
          <p className="text-3xl font-semibold text-[var(--color-text-primary)]">{value}</p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{label}</p>
        </div>
      </div>
    </article>
  );
}

export default GlowStat;
