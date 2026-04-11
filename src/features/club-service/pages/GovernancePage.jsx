import { useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import Modal from '@ds/components/Modal';
import Select from '@ds/components/Select';
import DashboardCard from '@dashboard/components/DashboardCard';
import { getGovernanceTemplates } from '@club/api/governance.api';
import { useOrganizationTree } from '@club/hooks/useDiscovery';
import { useIsAdmin, usePermission } from '@hooks/usePermission';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { clubApi } from '@services/axios';

const ROLE_OPTIONS = [
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

const roleAssignmentSchema = z.object({
  canonicalRole: z.enum(ROLE_OPTIONS),
  displayRoleName: z.string().optional(),
  scopeId: z.string().min(1, 'Select a scope'),
  scopeType: z.enum(['SCHOOL', 'SOCIETY', 'CLUB']),
  sessionId: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-YY e.g. 2025-26'),
  userId: z.string().min(1, 'User ID is required'),
});

function RoleAssignmentSection({ orgTree }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { units } = orgTree?.data ?? { units: [] };
  const queryClient = useQueryClient();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    defaultValues: { scopeType: 'CLUB', sessionId: '2025-26' },
    resolver: zodResolver(roleAssignmentSchema),
  });

  const selectedScopeType = watch('scopeType');
  const scopeOptions = units.filter((unit) => unit.type === selectedScopeType);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await clubApi.post('/roles/assign', values);
      queryClient.invalidateQueries({ queryKey: ['club-service', 'roles'] });
      toast.success('Role assigned successfully.');
      setOpen(false);
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Could not assign role.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DashboardCard icon="profile" title="Role Assignment">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
            Assign canonical roles to users within specific scopes. Roles are session-bound and
            determine what approval steps a user participates in.
          </p>
          <Button className="shrink-0" size="sm" onClick={() => setOpen(true)}>
            Assign Role
          </Button>
        </div>
      </DashboardCard>

      <Modal open={open} onClose={() => { setOpen(false); reset(); }} title="Assign Role">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="User ID (MongoDB ObjectId)"
            placeholder="000000000000000000000011"
            helperText="Get this from the auth-service user list."
            error={errors.userId?.message}
            {...register('userId')}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Scope Type" error={errors.scopeType?.message} {...register('scopeType')}>
              <option value="CLUB">Club</option>
              <option value="SOCIETY">Society</option>
              <option value="SCHOOL">School</option>
            </Select>
            <Select label="Scope" error={errors.scopeId?.message} {...register('scopeId')}>
              <option value="">Select scope</option>
              {scopeOptions.map((unit) => (
                <option key={String(unit._id)} value={String(unit._id)}>{unit.name}</option>
              ))}
            </Select>
          </div>
          <Select label="Canonical Role" error={errors.canonicalRole?.message} {...register('canonicalRole')}>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>{role.replace(/_/g, ' ')}</option>
            ))}
          </Select>
          <Input
            label="Display Role Name (optional)"
            placeholder="General Secretary"
            {...register('displayRoleName')}
          />
          <Input
            label="Session ID"
            placeholder="2025-26"
            error={errors.sessionId?.message}
            {...register('sessionId')}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => { setOpen(false); reset(); }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>Assign Role</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function GovernancePage() {
  const dashboard = useOutletContext() ?? {};
  const { can } = usePermission(dashboard.roles ?? []);
  const isAdmin = useIsAdmin();
  const orgTree = useOrganizationTree();

  const { data: templates, isLoading } = useQuery({
    enabled: can('ASSIGN_ROLES') || isAdmin,
    queryFn: getGovernanceTemplates,
    queryKey: ['club-service', 'governance', 'templates'],
  });

  if (!can('ASSIGN_ROLES') && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Governance"
        description="Platform governance policies, rules, and administrative controls."
      />

      <DashboardCard icon="governance" title="Governance Templates">
        {isLoading ? (
          <Loader />
        ) : !templates?.length ? (
          <EmptyState
            icon="governance"
            title="No templates configured"
            description="Governance templates will appear here once configured by a system administrator."
          />
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <article key={template._id} className="card-surface-muted p-4">
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  {template.templateName}
                </h3>
                {template.description ? (
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    {template.description}
                  </p>
                ) : null}
                {template.approvalWorkflow?.length ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {template.approvalWorkflow.map((step, index) => (
                      <span key={`${step.stepOrder}-${step.canonicalRole}`} className="flex items-center gap-1">
                        <span className="rounded-full bg-[var(--color-brand-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand)]">
                          {step.stepOrder}. {formatCanonicalRole(step.canonicalRole)}
                        </span>
                        {index < template.approvalWorkflow.length - 1 ? (
                          <span className="text-[var(--color-text-secondary)]">-&gt;</span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </DashboardCard>

      <DashboardCard icon="governance" title="Configuration Management">
        <EmptyState
          icon="governance"
          title="Coming Soon"
          description="Governance configuration assignment and role management tools will be available here."
        />
      </DashboardCard>

      {can('ASSIGN_ROLES') || isAdmin ? (
        <RoleAssignmentSection orgTree={orgTree} />
      ) : null}
    </div>
  );
}

export default GovernancePage;
