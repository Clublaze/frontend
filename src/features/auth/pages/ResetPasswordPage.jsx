import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import Button from '@ds/components/Button';
import { useResetPassword } from '@auth/hooks/useResetPassword';

const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include one uppercase letter')
      .regex(/[0-9]/, 'Password must include one number'),
  })
  .superRefine((values, context) => {
    if (values.newPassword !== values.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

function getPasswordStrength(password) {
  let score = 0;
  if ((password ?? '').length >= 8) score += 1;
  if (/[A-Z]/.test(password ?? '')) score += 1;
  if (/[0-9]/.test(password ?? '')) score += 1;
  if (/[^A-Za-z0-9]/.test(password ?? '')) score += 1;

  if (score <= 1) return { label: 'Weak', width: '25%' };
  if (score <= 2) return { label: 'Fair', width: '50%' };
  if (score === 3) return { label: 'Good', width: '75%' };
  return { label: 'Strong', width: '100%' };
}

function PasswordField({ error, label, onToggle, register, show, valueName }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
      <div className="relative">
        <input
          autoComplete="new-password"
          className="min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 pr-12 text-base text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)] sm:text-sm"
          placeholder={label}
          type={show ? 'text' : 'password'}
          {...register(valueName)}
        />
        <button
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          onClick={onToggle}
          type="button"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
    </label>
  );
}

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const resetPassword = useResetPassword();
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = useWatch({
    control,
    name: 'newPassword',
  });
  const passwordStrength = getPasswordStrength(password);

  if (!token) {
    return (
      <section className="auth-card text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Invalid reset link</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Invalid reset link. Please request a new one.
        </p>
        <div className="mt-6">
          <Link className="font-semibold text-[var(--color-brand)]" to="/forgot-password">
            Request a new reset link
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-card">
      <div className="text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Reset Password</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Choose a new password for your UniHub account.
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit((values) => resetPassword.mutate({ newPassword: values.newPassword, token }))}
      >
        <PasswordField
          error={errors.newPassword?.message}
          label="New Password"
          onToggle={() => setShowPassword((current) => !current)}
          register={register}
          show={showPassword}
          valueName="newPassword"
        />

        <div className="space-y-2">
          <div className="h-2 rounded-full bg-[var(--color-surface-soft)]">
            <div
              className="h-2 rounded-full bg-[var(--color-brand)] transition-all duration-200"
              style={{ width: passwordStrength.width }}
            />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">Strength: {passwordStrength.label}</p>
        </div>

        <PasswordField
          error={errors.confirmPassword?.message}
          label="Confirm Password"
          onToggle={() => setShowConfirmPassword((current) => !current)}
          register={register}
          show={showConfirmPassword}
          valueName="confirmPassword"
        />

        <Button className="w-full" isLoading={resetPassword.isPending} size="lg" type="submit">
          Reset Password
        </Button>
      </form>
    </section>
  );
}

export default ResetPasswordPage;
