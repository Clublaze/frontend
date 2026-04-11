import { useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import Modal from '@ds/components/Modal';
import Select from '@ds/components/Select';
import DashboardCard from '@dashboard/components/DashboardCard';
import {
  getGovernanceTemplates,
  getGovernanceConfig,
  createGovernanceConfig,
  updateGovernanceConfig,
  getGovernanceConfigHistory,
} from '@club/api/governance.api';
import { useOrganizationTree } from '@club/hooks/useDiscovery';
import { useIsAdmin, usePermission } from '@hooks/usePermission';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { formatDate } from '@dashboard/utils/dashboardFormatters';
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

const SCOPE_OPTIONS = ['CLUB', 'SOCIETY', 'SCHOOL'];

const roleAssignmentSchema = z.object({
  canonicalRole: z.enum(ROLE_OPTIONS),
  displayRoleName: z.string().optional(),
  scopeId: z.string().min(1, 'Select a scope'),
  scopeType: z.enum(['SCHOOL', 'SOCIETY', 'CLUB']),
  sessionId: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-YY e.g. 2025-26'),
  userId: z.string().min(1, 'User ID is required'),
});

const configSchema = z.object({
  approvalWorkflow: z.array(z.object({
    canonicalRole: z.string().min(1),
    scopeOverride: z.string().optional(),
    isOptional: z.boolean().optional(),
  })).min(1, 'At least one step required'),
  rules: z.object({
    minimumNoticeDays: z.coerce.number().min(0),
    requiresBudgetApproval: z.boolean(),
    ecrDeadlineDays: z.coerce.number().min(0),
    blackoutDaysBeforeExam: z.coerce.number().min(0),
    requiresTrio: z.boolean(),
    requiresSettlement: z.boolean(),
  }),
  effectiveFrom: z.string().min(1),
});

function buildConfigDefaults(existingConfig) {
  if (existingConfig) {
    return {
      approvalWorkflow: existingConfig.approvalWorkflow?.map((step) => ({
        canonicalRole: step.canonicalRole,
        scopeOverride: step.scopeOverride ?? '',
        isOptional: step.isOptional ?? false,
      })) ?? [],
      rules: existingConfig.rules ?? {
        minimumNoticeDays: 15,
        requiresBudgetApproval: true,
        ecrDeadlineDays: 3,
        blackoutDaysBeforeExam: 15,
        requiresTrio: true,
        requiresSettlement: true,
      },
      effectiveFrom: new Date().toISOString().split('T')[0],
    };
  }

  return {
    approvalWorkflow: [{ canonicalRole: 'SECRETARY', scopeOverride: 'SOCIETY', isOptional: false }],
    rules: {
      minimumNoticeDays: 15,
      requiresBudgetApproval: true,
      ecrDeadlineDays: 3,
      blackoutDaysBeforeExam: 15,
      requiresTrio: true,
      requiresSettlement: true,
    },
    effectiveFrom: new Date().toISOString().split('T')[0],
  };
}

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

function ConfigFormModal({ open, onClose, existingConfig, onSubmit, isPending }) {
  const defaultValues = buildConfigDefaults(existingConfig);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(configSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(buildConfigDefaults(existingConfig));
    }
  }, [existingConfig, open, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: 'approvalWorkflow' });
  const workflowValues = useWatch({ control, name: 'approvalWorkflow' });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={existingConfig ? 'Update Governance Config' : 'Create Governance Config'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Approval Steps</span>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {workflowValues?.length ?? 0} configured
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => append({ canonicalRole: '', scopeOverride: '', isOptional: false })}
            >
              + Add Step
            </Button>
          </div>
          {typeof errors.approvalWorkflow?.message === 'string' && (
            <p className="mb-3 text-sm text-[var(--color-danger)]">{errors.approvalWorkflow.message}</p>
          )}
          {fields.map((field, idx) => (
            <div key={field.id} className="mb-3 space-y-2 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">Step {idx + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Role"
                  error={errors.approvalWorkflow?.[idx]?.canonicalRole?.message}
                  {...register(`approvalWorkflow.${idx}.canonicalRole`)}
                >
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role.replace(/_/g, ' ')}</option>)}
                </Select>
                <Select
                  label="Scope Override"
                  error={errors.approvalWorkflow?.[idx]?.scopeOverride?.message}
                  {...register(`approvalWorkflow.${idx}.scopeOverride`)}
                >
                  <option value="">None</option>
                  {SCOPE_OPTIONS.map((scope) => <option key={scope} value={scope}>{scope}</option>)}
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <input type="checkbox" {...register(`approvalWorkflow.${idx}.isOptional`)} />
                Optional step
              </label>
              {fields.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-[var(--color-danger)]"
                  onClick={() => remove(idx)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">Rules</p>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min Notice Days" type="number" error={errors.rules?.minimumNoticeDays?.message} {...register('rules.minimumNoticeDays')} />
            <Input label="ECR Deadline Days" type="number" error={errors.rules?.ecrDeadlineDays?.message} {...register('rules.ecrDeadlineDays')} />
            <Input label="Blackout Days" type="number" error={errors.rules?.blackoutDaysBeforeExam?.message} {...register('rules.blackoutDaysBeforeExam')} />
          </div>
          {[
            ['requiresBudgetApproval', 'Requires budget approval'],
            ['requiresTrio', 'Requires trio documents'],
            ['requiresSettlement', 'Requires settlement'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input type="checkbox" {...register(`rules.${key}`)} />
              {label}
            </label>
          ))}
        </div>

        <Input label="Effective From" type="date" error={errors.effectiveFrom?.message} {...register('effectiveFrom')} />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isPending}>Save Config</Button>
        </div>
      </form>
    </Modal>
  );
}

function GovernancePage() {
  const dashboard = useOutletContext() ?? {};
  const { can } = usePermission(dashboard.roles ?? []);
  const isAdmin = useIsAdmin();
  const [selectedScopeId, setSelectedScopeId] = useState('');
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [templateDetailModal, setTemplateDetailModal] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const orgTree = useOrganizationTree();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    enabled: can('ASSIGN_ROLES') || isAdmin,
    queryFn: getGovernanceTemplates,
    queryKey: ['club-service', 'governance', 'templates'],
  });

  const configQuery = useQuery({
    queryKey: ['club-service', 'governance', 'config', selectedScopeId],
    queryFn: () => getGovernanceConfig(selectedScopeId),
    enabled: !!selectedScopeId,
    retry: false,
  });

  const historyQuery = useQuery({
    queryKey: ['club-service', 'governance', 'config', selectedScopeId, 'history'],
    queryFn: () => getGovernanceConfigHistory(selectedScopeId),
    enabled: !!selectedScopeId && historyModalOpen,
  });

  const configMutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        scopeId: selectedScopeId,
        approvalWorkflow: values.approvalWorkflow.map((step, idx) => ({
          ...step,
          stepOrder: idx + 1,
          stepType: 'SEQUENTIAL',
        })),
      };
      return configQuery.data
        ? updateGovernanceConfig(selectedScopeId, payload)
        : createGovernanceConfig(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'governance'] });
      toast.success('Governance config saved successfully.');
      setConfigModalOpen(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'Could not save config.');
    },
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
              <button
                key={template._id}
                type="button"
                className="w-full text-left"
                onClick={() => setTemplateDetailModal(template)}
              >
                <article className="card-surface-muted p-4">
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
                          <span className="rounded-full border border-[var(--color-brand)] bg-[var(--color-brand-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--color-brand)]">
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
              </button>
            ))}
          </div>
        )}
      </DashboardCard>

      <Modal
        open={!!templateDetailModal}
        onClose={() => setTemplateDetailModal(null)}
        title={templateDetailModal?.templateName ?? 'Template Detail'}
      >
        {templateDetailModal && (
          <div className="space-y-4">
            {templateDetailModal.description && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {templateDetailModal.description}
              </p>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Approval Workflow</p>
              {templateDetailModal.approvalWorkflow?.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-2">
                  <span
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)' }}
                  >
                    {step.stepOrder}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                      {step.canonicalRole?.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Scope: {step.scopeOverride ?? 'Default'}
                      {step.isOptional ? ' · Optional' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">Default Rules</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-[var(--color-text-secondary)]">Min notice days</span>
                <span className="text-[var(--color-text-primary)]">{templateDetailModal.defaultRules?.minimumNoticeDays}</span>
                <span className="text-[var(--color-text-secondary)]">ECR deadline days</span>
                <span className="text-[var(--color-text-primary)]">{templateDetailModal.defaultRules?.ecrDeadlineDays}</span>
                <span className="text-[var(--color-text-secondary)]">Requires budget</span>
                <span className="text-[var(--color-text-primary)]">{templateDetailModal.defaultRules?.requiresBudgetApproval ? 'Yes' : 'No'}</span>
                <span className="text-[var(--color-text-secondary)]">Requires trio docs</span>
                <span className="text-[var(--color-text-primary)]">{templateDetailModal.defaultRules?.requiresTrio ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <DashboardCard icon="governance" title="Configuration Management">
        <div className="space-y-4">
          <Select
            label="Select Scope"
            value={selectedScopeId}
            onChange={(e) => setSelectedScopeId(e.target.value)}
          >
            <option value="">Choose a school, society, or club...</option>
            {(orgTree.data?.units ?? []).map((unit) => (
              <option key={String(unit._id)} value={String(unit._id)}>
                {unit.name} ({unit.type})
              </option>
            ))}
          </Select>

          {selectedScopeId && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
              {configQuery.isLoading ? (
                <Loader />
              ) : configQuery.data ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Active Config — Version {configQuery.data.version}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {configQuery.data.approvalWorkflow?.length ?? 0} approval steps
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setHistoryModalOpen(true)}>
                        History
                      </Button>
                      <Button size="sm" onClick={() => setConfigModalOpen(true)}>
                        Update Config
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(configQuery.data.approvalWorkflow ?? []).map((step, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold"
                        style={{ background: 'var(--color-brand-soft)', color: 'var(--color-brand)', borderColor: 'var(--color-brand)' }}
                      >
                        {step.stepOrder}. {step.canonicalRole?.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    No governance configuration yet for this scope.
                  </p>
                  <Button size="sm" onClick={() => setConfigModalOpen(true)}>
                    Create Config
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardCard>

      <ConfigFormModal
        open={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        existingConfig={configQuery.data}
        onSubmit={configMutation.mutate}
        isPending={configMutation.isPending}
      />

      <Modal
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Config Version History"
      >
        {historyQuery.isLoading ? (
          <Loader />
        ) : (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {(historyQuery.data ?? []).map((v) => (
              <div key={v._id} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Version {v.version}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Effective from {formatDate(v.effectiveFrom)}
                  </p>
                </div>
                <span
                  className="rounded-full border px-2 py-0.5 text-xs font-semibold"
                  style={v.status === 'ACTIVE'
                    ? { background: 'var(--status-event-approved-bg)', color: 'var(--status-event-approved-text)', borderColor: 'var(--status-event-approved-border)' }
                    : { background: 'var(--color-surface)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }
                  }
                >
                  {v.status}
                </span>
              </div>
            ))}
            {(historyQuery.data ?? []).length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">No history yet.</p>
            )}
          </div>
        )}
      </Modal>

      {(can('ASSIGN_ROLES') || isAdmin) ? (
        <RoleAssignmentSection orgTree={orgTree} />
      ) : null}
    </div>
  );
}

export default GovernancePage;
