import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import Modal from '@ds/components/Modal';
import Select from '@ds/components/Select';
import Textarea from '@ds/components/Textarea';
import { useUpdateEvent } from '@club/hooks/useEventActions';

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

const eventEditSchema = z.object({
  title: z.string().min(3, 'Enter at least 3 characters').max(200, 'Maximum 200 characters').optional().or(z.literal('')),
  category: z.enum(EVENT_CATEGORIES).optional().or(z.literal('')),
  venue: z.string().min(2, 'Enter at least 2 characters').max(200, 'Maximum 200 characters').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().min(10, 'Enter at least 10 characters').max(2000, 'Maximum 2000 characters').optional().or(z.literal('')),
  objective: z.string().min(10, 'Enter at least 10 characters').max(1000, 'Maximum 1000 characters').optional().or(z.literal('')),
  expectedParticipants: z.union([
    z.coerce.number().int().min(1, 'Must be at least 1'),
    z.literal(''),
  ]).optional(),
  isPublic: z.boolean().optional(),
});

function toDateTimeInputValue(value) {
  if (!value) return '';

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

function getDefaultValues(event) {
  return {
    title: event?.title ?? '',
    category: event?.category ?? '',
    venue: event?.venue ?? '',
    startDate: toDateTimeInputValue(event?.startDate),
    endDate: toDateTimeInputValue(event?.endDate),
    description: event?.description ?? '',
    objective: event?.objective ?? '',
    expectedParticipants: event?.expectedParticipants ?? '',
    isPublic: Boolean(event?.isPublic),
  };
}

function filterPayload(values) {
  return Object.entries(values).reduce((payload, [key, value]) => {
    if (value === undefined || value === '') {
      return payload;
    }

    payload[key] = value;
    return payload;
  }, {});
}

function EventEditForm({ open, onClose, event }) {
  const updateEvent = useUpdateEvent();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: getDefaultValues(event),
    resolver: zodResolver(eventEditSchema),
  });

  useEffect(() => {
    if (open && event) {
      reset(getDefaultValues(event));
    }
  }, [event, open, reset]);

  const onSubmit = (values) => {
    const payload = filterPayload(values);

    updateEvent.mutate(
      { eventId: event?._id, payload },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Event">
      <form className="max-h-[70vh] space-y-4 overflow-y-auto pr-1" onSubmit={handleSubmit(onSubmit)}>
        <Input error={errors.title?.message} label="Title" {...register('title')} />

        <Select error={errors.category?.message} label="Category" {...register('category')}>
          <option value="">Select category</option>
          {EVENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category.replace(/_/g, ' ')}
            </option>
          ))}
        </Select>

        <Input error={errors.venue?.message} label="Venue" {...register('venue')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            error={errors.startDate?.message}
            label="Start Date"
            type="datetime-local"
            {...register('startDate')}
          />
          <Input
            error={errors.endDate?.message}
            label="End Date"
            type="datetime-local"
            {...register('endDate')}
          />
        </div>

        <Textarea
          error={errors.description?.message}
          label="Description"
          rows={4}
          {...register('description')}
        />

        <Textarea
          error={errors.objective?.message}
          label="Objective"
          rows={3}
          {...register('objective')}
        />

        <Input
          error={errors.expectedParticipants?.message}
          label="Expected Participants"
          type="number"
          {...register('expectedParticipants')}
        />

        <label className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Public Event</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Make this event visible in public discovery.
            </p>
          </div>
          <span className="relative inline-flex items-center">
            <input className="peer sr-only" type="checkbox" {...register('isPublic')} />
            <span className="h-7 w-12 rounded-full bg-[var(--color-border)] transition-colors peer-checked:bg-[var(--color-brand)]" />
            <span className="absolute left-1 h-5 w-5 rounded-full bg-[var(--color-surface)] transition-transform peer-checked:translate-x-5" />
          </span>
        </label>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button isLoading={updateEvent.isPending} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EventEditForm;
