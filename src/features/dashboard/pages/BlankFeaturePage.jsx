import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardCard from '@dashboard/components/DashboardCard';

function formatTitleFromPath(pathname) {
  const segment = pathname.split('/').filter(Boolean).at(-1) || 'dashboard';

  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function BlankFeaturePage({ description, icon = 'dashboard', title }) {
  const location = useLocation();
  const resolvedTitle = useMemo(
    () => title || formatTitleFromPath(location.pathname),
    [location.pathname, title],
  );

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Module
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          {resolvedTitle}
        </h1>
      </section>

      <DashboardCard icon={icon} title={`${resolvedTitle} Coming Soon`}>
        <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
          {description ||
            `This page is now routed and clickable from the sidebar. We can implement the ${resolvedTitle.toLowerCase()} feature next without changing the dashboard shell again.`}
        </p>
      </DashboardCard>
    </div>
  );
}

export default BlankFeaturePage;
