function MiniLineChart({ data = [], height = 120 }) {
  if (!data.length) return null;

  const width = 320;
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - (item.value / max) * (height - 12);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-3">
      <svg className="h-[120px] w-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendStroke" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" />
            <stop offset="100%" stopColor="var(--color-success)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          points={points}
          stroke="url(#trendStroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
      <div className="grid grid-cols-6 gap-2">
        {data.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-xs font-semibold text-[var(--color-text-primary)]">{item.value}</p>
            <p className="truncate text-[10px] text-[var(--color-text-secondary)]">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MiniLineChart;
