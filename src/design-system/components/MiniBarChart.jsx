function MiniBarChart({ data = [], height = 160 }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      <div className="flex h-[160px] items-end gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-[10px] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-brand)_85%,var(--color-success)_15%)_0%,color-mix(in_srgb,var(--color-brand)_45%,var(--color-surface-soft)_55%)_100%)]"
              style={{
                height: `${Math.max((item.value / max) * height, 12)}px`,
              }}
            />
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{item.value}</p>
              <p className="truncate text-[11px] text-[var(--color-text-secondary)]">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiniBarChart;
