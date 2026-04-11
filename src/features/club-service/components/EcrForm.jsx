import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@ds/components/Modal';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import Textarea from '@ds/components/Textarea';
import { useSubmitEcr } from '@club/hooks/useEcr';

const schema = z.object({
  actualParticipants: z.coerce.number().int().min(0, 'Required'),
  eventDescription: z.string().min(10, 'Min 10 characters').max(3000),
  feedbackSummary: z.string().max(1000).optional(),
  lessonsLearned: z.string().max(2000).optional(),
  objectivesAchieved: z.string().min(10, 'Min 10 characters').max(2000),
});

function EcrForm({ open, onClose, eventId }) {
  const submitEcr = useSubmitEcr();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (values) => {
    submitEcr.mutate(
      { eventId, payload: values },
      { onSuccess: () => { onClose(); reset(); } },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Event Completion Report">
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <Input
          label="Actual Participants"
          type="number"
          placeholder="0"
          error={errors.actualParticipants?.message}
          {...register('actualParticipants')}
        />
        <Textarea
          label="Objectives Achieved"
          placeholder="Describe how the event met its objectives..."
          rows={3}
          error={errors.objectivesAchieved?.message}
          {...register('objectivesAchieved')}
        />
        <Textarea
          label="Event Description"
          placeholder="Describe how the event went..."
          rows={4}
          error={errors.eventDescription?.message}
          {...register('eventDescription')}
        />
        <Textarea
          label="Lessons Learned (optional)"
          placeholder="What would you do differently next time?"
          rows={3}
          {...register('lessonsLearned')}
        />
        <Textarea
          label="Feedback Summary (optional)"
          placeholder="Summarize participant feedback..."
          rows={2}
          {...register('feedbackSummary')}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submitEcr.isPending}>Submit ECR</Button>
        </div>
      </form>
    </Modal>
  );
}

export default EcrForm;
