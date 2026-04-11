import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@ds/components/Modal';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import Textarea from '@ds/components/Textarea';
import { useSubmitSettlement } from '@club/hooks/useBudget';

const schema = z.object({
  actualExpense: z.coerce.number().min(0, 'Required'),
  actualIncome: z.coerce.number().min(0).optional(),
  advanceSettlement: z.coerce.number().min(0).optional(),
  expenseBreakdown: z.array(
    z.object({
      amount: z.coerce.number().min(0, 'Required'),
      category: z.string().min(1, 'Required'),
    }),
  ).min(1, 'Add at least one item'),
  notes: z.string().max(500).optional(),
});

function SettlementForm({ open, onClose, eventId }) {
  const submitSettlement = useSubmitSettlement();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: { expenseBreakdown: [{ amount: '', category: '' }] },
    resolver: zodResolver(schema),
  });
  const { append, fields, remove } = useFieldArray({ control, name: 'expenseBreakdown' });

  const onSubmit = (values) => {
    submitSettlement.mutate(
      { eventId, payload: values },
      { onSuccess: () => { onClose(); reset(); } },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Post-Event Settlement">
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Actual Expense (Rs.)"
            type="number"
            placeholder="4800"
            error={errors.actualExpense?.message}
            {...register('actualExpense')}
          />
          <Input
            label="Actual Income (Rs.)"
            type="number"
            placeholder="0"
            {...register('actualIncome')}
          />
          <Input
            label="Advance Settlement (Rs.)"
            type="number"
            placeholder="0"
            {...register('advanceSettlement')}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Breakdown</span>
            <Button
              className="h-auto px-0 py-0 text-[var(--color-brand)] hover:bg-transparent hover:underline"
              type="button"
              variant="ghost"
              onClick={() => append({ amount: '', category: '' })}
            >
              + Add item
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Category"
                placeholder="Venue"
                error={errors.expenseBreakdown?.[index]?.category?.message}
                {...register(`expenseBreakdown.${index}.category`)}
              />
              <Input
                label="Amount (Rs.)"
                type="number"
                placeholder="3000"
                error={errors.expenseBreakdown?.[index]?.amount?.message}
                {...register(`expenseBreakdown.${index}.amount`)}
              />
              {fields.length > 1 ? (
                <Button
                  className="h-auto px-0 py-0 text-left text-[var(--color-danger)] hover:bg-transparent hover:underline sm:col-span-2"
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}
        </div>

        <Textarea label="Notes (optional)" rows={2} {...register('notes')} />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submitSettlement.isPending}>Submit Settlement</Button>
        </div>
      </form>
    </Modal>
  );
}

export default SettlementForm;
