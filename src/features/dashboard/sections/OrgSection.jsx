import DashboardCard from '@dashboard/components/DashboardCard';

function OrgSection({ organizations = [], stats = {}, templates = [] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <DashboardCard actionLabel="Topology" icon="dashboard" title="Organization Overview">
        <div className="grid gap-3 md:grid-cols-2">
          <article className="card-surface-muted p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Clubs</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
              {organizations.filter((organization) => organization.type === 'CLUB').length}
            </p>
          </article>
          <article className="card-surface-muted p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Societies</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
              {organizations.filter((organization) => organization.type === 'SOCIETY').length}
            </p>
          </article>
          <article className="card-surface-muted p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Active clubs</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
              {stats.activeClubs ?? 0}
            </p>
          </article>
          <article className="card-surface-muted p-4">
            <p className="text-sm text-[var(--color-text-secondary)]">Approval backlog</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-text-primary)]">
              {stats.approvalsPending ?? 0}
            </p>
          </article>
        </div>
      </DashboardCard>

      <DashboardCard actionLabel="Governance" icon="governance" title="Governance Readiness">
        <div className="space-y-3">
          {templates.length ? (
            templates.map((template) => (
              <article className="card-surface-muted p-4" key={template._id}>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  {template.name || `Template ${template._id?.slice?.(-4) ?? ''}`}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {template.description || 'Governance flow is available for downstream scopes.'}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Governance templates have not been configured yet.
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
}

export default OrgSection;
