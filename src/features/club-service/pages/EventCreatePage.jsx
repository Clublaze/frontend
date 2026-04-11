import { useMemo, useState } from 'react';
import { Navigate, useOutletContext, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import Select from '@ds/components/Select';
import Textarea from '@ds/components/Textarea';
import { createEvent } from '@club/api/events.api';
import { submitBudget } from '@club/api/budget.api';
import { usePermission } from '@hooks/usePermission';

const EVENT_CATEGORIES = [
  'WORKSHOP',
  'SEMINAR',
  'HACKATHON',
  'COMPETITION',
  'CULTURAL',
  'GUEST_LECTURE',
  'FDP',
  'WEBINAR',
  'INDUSTRIAL_VISIT',
  'OTHER',
];

const steps = ['Basic Info', 'Event Details', 'Documents', 'Budget'];

const schema = z.object({
  advanceRequired: z.coerce.number().min(0).optional(),
  agendaUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  brochureUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  category: z.enum(EVENT_CATEGORIES),
  description: z.string().min(10, 'Enter at least 10 characters'),
  endDate: z.string().min(1, 'Required'),
  objective: z.string().min(10, 'Enter at least 10 characters'),
  organizingClubId: z.string().min(1, 'Select a club'),
  posterUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  proposedExpense: z.coerce.number().min(0).optional(),
  sponsorshipAmount: z.coerce.number().min(0).optional(),
  startDate: z.string().min(1, 'Required'),
  title: z.string().min(3, 'Enter at least 3 characters'),
  venue: z.string().min(2, 'Required'),
}).refine((values) => new Date(values.endDate) >= new Date(values.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

const fieldsByStep = [
  ['title', 'category', 'organizingClubId'],
  ['venue', 'startDate', 'endDate', 'description', 'objective'],
  ['posterUrl', 'agendaUrl', 'brochureUrl'],
  ['proposedExpense', 'sponsorshipAmount', 'advanceRequired'],
];

function StepIndicator({ currentStep }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;

        return (
          <div key={label} className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold"
              style={{
                background: isActive || isDone ? 'var(--color-brand-soft)' : 'var(--color-surface-soft)',
                borderColor: isActive || isDone ? 'var(--color-brand)' : 'var(--color-border)',
                color: isActive || isDone ? 'var(--color-brand)' : 'var(--color-text-secondary)',
              }}
            >
              {index + 1}
            </span>
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function EventCreatePage() {
  const dashboard = useOutletContext() ?? {};
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { can } = usePermission(dashboard.roles ?? []);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    trigger,
  } = useForm({
    defaultValues: {
      advanceRequired: 0,
      agendaUrl: '',
      brochureUrl: '',
      category: 'WORKSHOP',
      description: '',
      endDate: '',
      objective: '',
      organizingClubId: '',
      posterUrl: '',
      proposedExpense: 0,
      sponsorshipAmount: 0,
      startDate: '',
      title: '',
      venue: '',
    },
    resolver: zodResolver(schema),
  });

  const managedClubs = useMemo(() => dashboard.managedClubs ?? [], [dashboard.managedClubs]);

  const goNext = async () => {
    const valid = await trigger(fieldsByStep[currentStep]);
    if (valid) setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        category: values.category,
        description: values.description,
        endDate: values.endDate,
        objective: values.objective,
        organizingClubId: values.organizingClubId,
        startDate: values.startDate,
        title: values.title,
        venue: values.venue,
        attachments: {
          agenda: values.agendaUrl || undefined,
          brochure: values.brochureUrl || undefined,
          poster: values.posterUrl || undefined,
        },
        isPublic: true,
      };

      const createdEvent = await createEvent(payload);

      if ((values.proposedExpense ?? 0) > 0) {
        await submitBudget(createdEvent._id, {
          advanceRequired: values.advanceRequired ?? 0,
          expenseBreakdown: [
            {
              amount: values.proposedExpense ?? 0,
              category: 'General Budget',
            },
          ],
          proposedExpense: values.proposedExpense ?? 0,
          sponsorshipAmount: values.sponsorshipAmount ?? 0,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['club-service', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['club-service', 'discover', 'events'] });
      toast.success('Event created successfully.');
      navigate('/dashboard/events');
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Could not create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!can('CREATE_EVENT')) {
    return <Navigate replace to="/dashboard/events" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Event"
        description="Build an event in four steps: basics, details, documents, and budget."
      />

      <section className="card-surface p-6">
        <StepIndicator currentStep={currentStep} />
      </section>

      <section className="card-surface p-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Event Title" error={errors.title?.message} {...register('title')} />
              <Select label="Category" error={errors.category?.message} {...register('category')}>
                {EVENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category.replace(/_/g, ' ')}</option>
                ))}
              </Select>
              <div className="sm:col-span-2">
                <Select
                  label="Organising Club"
                  error={errors.organizingClubId?.message}
                  {...register('organizingClubId')}
                >
                  <option value="">Select a club</option>
                  {managedClubs.map((role) => (
                    <option key={String(role.scopeId)} value={String(role.scopeId)}>
                      {role.scope?.name ?? 'Club'}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Venue" error={errors.venue?.message} {...register('venue')} />
                <Input
                  label="Start Date"
                  type="datetime-local"
                  error={errors.startDate?.message}
                  {...register('startDate')}
                />
                <Input
                  label="End Date"
                  type="datetime-local"
                  error={errors.endDate?.message}
                  {...register('endDate')}
                />
              </div>
              <Textarea
                label="Description"
                rows={4}
                error={errors.description?.message}
                {...register('description')}
              />
              <Textarea
                label="Objective"
                rows={3}
                error={errors.objective?.message}
                {...register('objective')}
              />
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Poster URL" error={errors.posterUrl?.message} {...register('posterUrl')} />
              <Input label="Agenda URL" error={errors.agendaUrl?.message} {...register('agendaUrl')} />
              <div className="sm:col-span-2">
                <Input label="Brochure URL" error={errors.brochureUrl?.message} {...register('brochureUrl')} />
              </div>
            </div>
          ) : null}

          {currentStep === 3 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Proposed Expense (Rs.)"
                type="number"
                error={errors.proposedExpense?.message}
                {...register('proposedExpense')}
              />
              <Input
                label="Sponsorship Amount (Rs.)"
                type="number"
                error={errors.sponsorshipAmount?.message}
                {...register('sponsorshipAmount')}
              />
              <Input
                label="Advance Required (Rs.)"
                type="number"
                error={errors.advanceRequired?.message}
                {...register('advanceRequired')}
              />
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4 sm:col-span-2">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Budget preview</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Proposed expense: Rs. {(getValues('proposedExpense') ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Sponsorship: Rs. {(getValues('sponsorshipAmount') ?? 0).toLocaleString()}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3 pt-2">
            <div className="flex gap-3">
              <Button
                variant="secondary"
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
              >
                Back
              </Button>
              <Button variant="ghost" type="button" onClick={() => navigate('/dashboard/events')}>
                Cancel
              </Button>
            </div>
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={goNext}>Next Step</Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting}>Create Event</Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

export default EventCreatePage;
