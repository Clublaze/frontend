import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import { useSignup } from '@auth/hooks/useSignup';

const signupSchema = z
  .object({
    accountType: z.enum(['student', 'faculty']),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include one uppercase letter')
      .regex(/[0-9]/, 'Password must include one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    systemId: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }

    if (values.accountType === 'student' && !values.systemId?.trim()) {
      context.addIssue({
        code: 'custom',
        message: 'System ID is required for students',
        path: ['systemId'],
      });
    }
  });

function SignupForm() {
  const signupMutation = useSignup();
  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
    setValue,
  } = useForm({
    defaultValues: {
      accountType: 'student',
      email: '',
      password: '',
      confirmPassword: '',
      systemId: '',
    },
    resolver: zodResolver(signupSchema),
  });

  const accountType = useWatch({
    control,
    name: 'accountType',
  });

  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={handleSubmit((formValues) =>
        signupMutation.mutate({
          accountType: formValues.accountType,
          email: formValues.email,
          password: formValues.password,
          systemId: formValues.systemId,
        }),
      )}
    >
      <input type="hidden" {...register('accountType')} />

      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-1">
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
          {['student', 'faculty'].map((type) => {
            const isActive = accountType === type;

            return (
              <button
                key={type}
                className={[
                  'rounded-[calc(var(--radius-md)-0.2rem)] px-4 py-3 text-sm font-medium capitalize transition-all duration-200',
                  isActive
                    ? 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]'
                    : 'border border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                ].join(' ')}
                onClick={() => setValue('accountType', type, { shouldValidate: true })}
                type="button"
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <Input
        autoComplete="email"
        error={errors.email?.message}
        label="Email"
        placeholder="you@university.edu"
        {...register('email')}
      />

      {accountType === 'student' ? (
        <Input
          error={errors.systemId?.message}
          label="System ID"
          placeholder="Enter your university ID"
          {...register('systemId')}
        />
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          autoComplete="new-password"
          error={errors.password?.message}
          label="Password"
          placeholder="Create a strong password"
          type="password"
          {...register('password')}
        />

        <Input
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          label="Confirm Password"
          placeholder="Repeat your password"
          type="password"
          {...register('confirmPassword')}
        />
      </div>

      <Button className="w-full" isLoading={signupMutation.isPending} size="lg" type="submit">
        Create Account
      </Button>

      <p className="px-2 text-center text-sm leading-6 text-[var(--color-text-secondary)]">
        Already have an account?{' '}
        <Link className="font-semibold text-[var(--color-brand)]" to="/login">
          Login
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
