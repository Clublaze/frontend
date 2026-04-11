import Icon from '@dashboard/components/Icon';

const statThemes = {
  brand: {
    accent: 'var(--color-brand)',
    background:
      'color-mix(in srgb, var(--color-brand) 10%, var(--color-surface) 90%)',
    border:
      'color-mix(in srgb, var(--color-brand) 24%, var(--color-border) 76%)',
    iconBackground: 'color-mix(in srgb, var(--color-brand) 16%, transparent)',
  },
  success: {
    accent: 'var(--color-success)',
    background:
      'color-mix(in srgb, var(--color-success) 10%, var(--color-surface) 90%)',
    border:
      'color-mix(in srgb, var(--color-success) 24%, var(--color-border) 76%)',
    iconBackground: 'color-mix(in srgb, var(--color-success) 16%, transparent)',
  },
  neutral: {
    accent: 'var(--color-text-primary)',
    background:
      'color-mix(in srgb, var(--color-text-primary) 4%, var(--color-surface) 96%)',
    border:
      'color-mix(in srgb, var(--color-text-primary) 16%, var(--color-border) 84%)',
    iconBackground:
      'color-mix(in srgb, var(--color-text-primary) 10%, transparent)',
  },
  danger: {
    accent: 'var(--color-danger)',
    background:
      'color-mix(in srgb, var(--color-danger) 9%, var(--color-surface) 91%)',
    border:
      'color-mix(in srgb, var(--color-danger) 22%, var(--color-border) 78%)',
    iconBackground: 'color-mix(in srgb, var(--color-danger) 14%, transparent)',
  },
};

function StatCard({
  icon = 'dashboard',
  label,
  theme = 'brand',
  value,
}) {
  const colors = statThemes[theme] ?? statThemes.brand;

  return (
    <article
      className="rounded-[var(--radius-xl)] border p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6"
      style={{
        background: colors.background,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-4">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)]"
          style={{
            background: colors.iconBackground,
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

export default StatCard;
