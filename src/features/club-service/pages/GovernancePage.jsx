import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import Button from '@ds/components/Button';
import EmptyState from '@ds/components/EmptyState';
import Input from '@ds/components/Input';
import Loader from '@ds/components/Loader';
import PageHeader from '@ds/components/PageHeader';
import Select from '@ds/components/Select';
import {
  useAssignRole,
  useRemoveRole,
  useScopeRoles,
} from '@club/hooks/useRoleManagement';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { formatDate } from '@dashboard/utils/dashboardFormatters';
import { useIsAdmin, usePermission } from '@hooks/usePermission';
import { selectUser } from '@store/authSlice';

const CANONICAL_ROLES = [
  'PRESIDENT',
  'VICE_PRESIDENT',
  'SECRETARY',
  'TREASURER',
  'PR_HEAD',
  'CLUB_LEAD',
  'CO_LEAD',
  'COORDINATOR',
  'FACULTY_ADVISOR',
  'HOD',
  'DEAN',
];
const EMPTY_ARRAY = [];

const roleAssignmentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  scopeId: z.string().min(1, 'Select a scope'),
  canonicalRole: z.enum(CANONICAL_ROLES),
  displayRoleName: z.string().max(100, 'Maximum 100 characters').optional().or(z.literal('')),
  sessionId: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-YY'),
});

function getCurrentSessionId() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  if (month >= 6) {
    return `${year}-${String(year + 1).slice(2)}`;
  }

  return `${year - 1}-${String(year).slice(2)}`;
}

function TemplateCard({ template }) {
  return (
    <article className="card-surface-muted space-y-4 p-5">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {template.templateName}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
          {template.description || 'No description available.'}
        </p>
      </div>

      <div className="space-y-2">
        {(template.approvalWorkflow ?? []).map((step, index) => (
          <div
            key={`${template._id}-${step.stepOrder ?? index}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-sm font-semibold text-[var(--color-brand)]">
              {step.stepOrder ?? index + 1}
            </span>
            <p className="text-sm text-[var(--color-text-primary)]">
              Step {step.stepOrder ?? index + 1} - {formatCanonicalRole(step.canonicalRole)} ({step.scopeOverride ?? 'DEFAULT'} scope)
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ScopeRolesCard({ canManageRoles, scope }) {
  const scopeRolesQuery = useScopeRoles(scope._id);
  const removeRole = useRemoveRole();
  const roles = scopeRolesQuery.data ?? [];

  return (
    <details className="card-surface-muted overflow-hidden">
      <summary className="cursor-pointer list-none px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">{scope.name}</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{scope.type}</p>
          </div>
          <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            {roles.length} role{roles.length === 1 ? '' : 's'}
          </span>
        </div>
      </summary>

      <div className="border-t border-[var(--color-border)] px-5 py-5">
        {scopeRolesQuery.isLoading ? (
          <Loader size="md" text="Loading roles..." />
        ) : roles.length ? (
          <div className="space-y-3">
            {roles.map((role) => (
              <article
                key={role._id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatCanonicalRole(role.canonicalRole)}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">User ID: {role.userId}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Assigned {formatDate(role.assignedAt)}
                  </p>
                </div>

                {canManageRoles ? (
                  <Button
                    isLoading={removeRole.isPending}
                    onClick={() => removeRole.mutate({ roleId: role._id })}
                    size="sm"
                    style={{ background: 'var(--color-danger)', color: 'var(--color-text-on-brand)' }}
                  >
                    Remove
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="No active role holders have been assigned for this scope yet."
            icon="governance"
            title="No roles assigned"
          />
        )}
      </div>
    </details>
  );
}

function GovernancePage() {
  const dashboard = useOutletContext() ?? {};
  const user = useSelector(selectUser);
  const isAdmin = useIsAdmin();
  const { can } = usePermission(dashboard.roles ?? []);
  const canManageRoles = can('ASSIGN_ROLES') || isAdmin;
  const organizations = dashboard.organizations ?? EMPTY_ARRAY;
  const governanceTemplates = dashboard.governanceTemplates ?? EMPTY_ARRAY;
  const societies = organizations.filter((organization) => organization.type === 'SOCIETY');
  const assignRole = useAssignRole();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      userId: '',
      scopeId: '',
      scopeType: '',
      canonicalRole: 'PRESIDENT',
      displayRoleName: '',
      sessionId: getCurrentSessionId(),
    },
    resolver: zodResolver(roleAssignmentSchema),
  });

  const selectedScopeId = useWatch({
    control,
    name: 'scopeId',
  });

  useEffect(() => {
    const selectedOrganization = organizations.find(
      (organization) => String(organization._id) === String(selectedScopeId),
    );

    setValue('scopeType', selectedOrganization?.type ?? '');
  }, [organizations, selectedScopeId, setValue]);

  if (!canManageRoles) {
    return <Navigate replace to="/dashboard" />;
  }

  const onSubmit = (values) => {
    const selectedOrganization = organizations.find(
      (organization) => String(organization._id) === String(values.scopeId),
    );

    if (!selectedOrganization) {
      return;
    }

    assignRole.mutate(
      {
        ...values,
        displayRoleName: values.displayRoleName?.trim() || undefined,
        scopeType: selectedOrganization.type,
        universityId: user?.universityId,
      },
      {
        onSuccess: () => {
          reset({
            userId: '',
            scopeId: '',
            scopeType: '',
            canonicalRole: 'PRESIDENT',
            displayRoleName: '',
            sessionId: getCurrentSessionId(),
          });
        },
      },
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        description="Manage approval workflows and assign roles."
        title="Governance"
      />

      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">System Templates</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Default governance workflows available across the platform.
        </p>

        {governanceTemplates.length ? (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {governanceTemplates.map((template) => (
              <TemplateCard key={template._id} template={template} />
            ))}
          </div>
        ) : (
          <EmptyState
            description="Templates will appear here when governance data is available."
            icon="governance"
            title="No templates found"
          />
        )}
      </section>

      <section className="card-surface p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Active Governance Configs</h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Review active role holders across society scopes.
        </p>

        {societies.length ? (
          <div className="mt-5 space-y-4">
            {societies.map((society) => (
              <ScopeRolesCard
                canManageRoles={canManageRoles}
                key={society._id}
                scope={society}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            description="No society organizations are available for governance management yet."
            icon="governance"
            title="No active configurations"
          />
        )}
      </section>

      {canManageRoles ? (
        <section className="card-surface p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Assign New Role</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Assign a canonical role to a user for a specific organization scope.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('scopeType')} />

            <Input
              error={errors.userId?.message}
              helperText="Enter the user's MongoDB ID from auth-service"
              label="User ID"
              {...register('userId')}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Select error={errors.scopeId?.message} label="Scope" {...register('scopeId')}>
                <option value="">Select scope</option>
                {organizations.map((organization) => (
                  <option key={organization._id} value={organization._id}>
                    {organization.name} ({organization.type})
                  </option>
                ))}
              </Select>

              <Select error={errors.canonicalRole?.message} label="Role" {...register('canonicalRole')}>
                {CANONICAL_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {formatCanonicalRole(role)}
                  </option>
                ))}
              </Select>
            </div>

            <Input
              helperText="Custom label e.g. 'General Secretary'"
              label="Display Name (optional)"
              {...register('displayRoleName')}
            />

            <Input
              error={errors.sessionId?.message}
              helperText="Format: YYYY-YY"
              label="Session"
              placeholder="2025-26"
              {...register('sessionId')}
            />

            <div className="flex justify-end">
              <Button isLoading={assignRole.isPending} type="submit">
                Assign Role
              </Button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}

export default GovernancePage;
