import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const password = useWatch({
    control,
    name: 'password',
  });

  const passwordStrength = useMemo(() => {
    let score = 0;
    if ((password ?? '').length >= 8) score += 1;
    if (/[A-Z]/.test(password ?? '')) score += 1;
    if (/[0-9]/.test(password ?? '')) score += 1;
    if (/[^A-Za-z0-9]/.test(password ?? '')) score += 1;

    if (score <= 1) return { label: 'Weak', width: '25%' };
    if (score <= 2) return { label: 'Fair', width: '50%' };
    if (score === 3) return { label: 'Good', width: '75%' };
    return { label: 'Strong', width: '100%' };
  }, [password]);

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
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">Password</span>
          <div className="relative">
            <input
              autoComplete="new-password"
              className="min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 pr-12 text-base text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)] sm:text-sm"
              placeholder="Create a strong password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
            />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-[var(--color-surface-soft)]">
              <div
                className="h-2 rounded-full bg-[var(--color-brand)] transition-all duration-200"
                style={{ width: passwordStrength.width }}
              />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">Strength: {passwordStrength.label}</p>
          </div>
          {errors.password ? <p className="text-sm text-[var(--color-danger)]">{errors.password.message}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">Confirm Password</span>
          <div className="relative">
            <input
              autoComplete="new-password"
              className="min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 pr-12 text-base text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)] sm:text-sm"
              placeholder="Repeat your password"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
            />
            <button
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              onClick={() => setShowConfirmPassword((current) => !current)}
              type="button"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword ? <p className="text-sm text-[var(--color-danger)]">{errors.confirmPassword.message}</p> : null}
        </label>
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
