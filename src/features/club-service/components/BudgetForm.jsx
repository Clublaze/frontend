import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@ds/components/Modal';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import { useSubmitBudget } from '@club/hooks/useBudget';

const schema = z.object({
  advanceRequired: z.coerce.number().min(0).optional(),
  expenseBreakdown: z.array(
    z.object({
      amount: z.coerce.number().min(0, 'Amount required'),
      category: z.string().min(1, 'Category required'),
      notes: z.string().optional(),
    }),
  ).min(1, 'Add at least one expense item'),
  proposedExpense: z.coerce.number().min(1, 'Required'),
  proposedIncome: z.coerce.number().min(0).optional(),
  sponsorshipAmount: z.coerce.number().min(0).optional(),
});

const defaultValues = {
  advanceRequired: '',
  expenseBreakdown: [{ amount: '', category: '', notes: '' }],
  proposedExpense: '',
  proposedIncome: '',
  sponsorshipAmount: '',
};

function BudgetForm({ open, onClose, eventId, existingBudget }) {
  const submitBudget = useSubmitBudget();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { append, fields, remove } = useFieldArray({ control, name: 'expenseBreakdown' });

  useEffect(() => {
    if (!open) return;

    if (existingBudget) {
      reset({
        advanceRequired: existingBudget.advanceRequired ?? '',
        expenseBreakdown: existingBudget.expenseBreakdown?.length
          ? existingBudget.expenseBreakdown
          : defaultValues.expenseBreakdown,
        proposedExpense: existingBudget.proposedExpense ?? '',
        proposedIncome: existingBudget.proposedIncome ?? '',
        sponsorshipAmount: existingBudget.sponsorshipAmount ?? '',
      });
      return;
    }

    reset(defaultValues);
  }, [existingBudget, open, reset]);

  const onSubmit = (values) => {
    submitBudget.mutate(
      { eventId, payload: values },
      { onSuccess: () => { onClose(); reset(defaultValues); } },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit Budget">
      <form onSubmit={handleSubmit(onSubmit)} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Total Proposed Expense (Rs.)"
            type="number"
            placeholder="5000"
            error={errors.proposedExpense?.message}
            {...register('proposedExpense')}
          />
          <Input
            label="Expected Income (Rs.)"
            type="number"
            placeholder="0"
            {...register('proposedIncome')}
          />
          <Input
            label="Sponsorship Amount (Rs.)"
            type="number"
            placeholder="0"
            {...register('sponsorshipAmount')}
          />
          <Input
            label="Advance Required (Rs.)"
            type="number"
            placeholder="0"
            {...register('advanceRequired')}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              Expense Breakdown
            </span>
            <Button
              className="h-auto px-0 py-0 text-[var(--color-brand)] hover:bg-transparent hover:underline"
              type="button"
              variant="ghost"
              onClick={() => append({ amount: '', category: '', notes: '' })}
            >
              + Add item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Category"
                  placeholder="Venue, printing"
                  error={errors.expenseBreakdown?.[index]?.category?.message}
                  {...register(`expenseBreakdown.${index}.category`)}
                />
                <Input
                  label="Amount (Rs.)"
                  type="number"
                  placeholder="1000"
                  error={errors.expenseBreakdown?.[index]?.amount?.message}
                  {...register(`expenseBreakdown.${index}.amount`)}
                />
              </div>
              {fields.length > 1 ? (
                <Button
                  className="mt-2 h-auto px-0 py-0 text-[var(--color-danger)] hover:bg-transparent hover:underline"
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              ) : null}
            </div>
          ))}

          {errors.expenseBreakdown?.message ? (
            <p className="text-sm text-[var(--color-danger)]">{errors.expenseBreakdown.message}</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submitBudget.isPending}>Submit Budget</Button>
        </div>
      </form>
    </Modal>
  );
}

export default BudgetForm;
