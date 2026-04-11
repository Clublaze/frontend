import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { getUserDisplayName } from '@dashboard/utils/userPresentation';

function getRoleLabel(role) {
  if (role === 'ADMIN') return 'Administrator';
  if (role === 'FACULTY') return 'Faculty Member';
  if (role === 'STUDENT') return 'Campus Member';
  return formatCanonicalRole(role);
}

function DashboardHeader({ role, roles = [], user }) {
  return (
    <section className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          Welcome back,{' '}
          <span className="text-[var(--color-brand)]">
            {getUserDisplayName(user)}
          </span>
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Viewing as {getRoleLabel(role)} - Here is your overview.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {roles.slice(0, 4).map((item) => (
          <span
            key={item._id}
            className="rounded-full border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-brand)_12%,transparent)] px-3 py-1.5 text-sm font-medium text-[var(--color-brand)]"
          >
            {formatCanonicalRole(item.canonicalRole)}
          </span>
        ))}
      </div>
    </section>
  );
}

export default DashboardHeader;
