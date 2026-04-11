import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import { useForgotPassword } from '@auth/hooks/useForgotPassword';

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <section className="auth-card">
      <div className="text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Forgot your password?</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Enter your account email and we&apos;ll send a reset link if the address exists.
        </p>
      </div>

      {forgotPassword.isSuccess ? (
        <div className="mt-8 space-y-5 text-center">
          <p className="auth-body-copy text-[var(--color-text-secondary)]">
            If this email is registered, you&apos;ll receive a reset link. Check your inbox.
          </p>
          <Link className="font-semibold text-[var(--color-brand)]" to="/login">
            Back to login
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit((values) => forgotPassword.mutate(values))}>
          <Input
            autoComplete="email"
            error={errors.email?.message}
            label="Email"
            placeholder="you@university.edu"
            {...register('email')}
          />

          <Button className="w-full" isLoading={forgotPassword.isPending} size="lg" type="submit">
            Send Reset Link
          </Button>

          <p className="text-center text-sm leading-6 text-[var(--color-text-secondary)]">
            Remembered your password?{' '}
            <Link className="font-semibold text-[var(--color-brand)]" to="/login">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </section>
  );
}

export default ForgotPasswordPage;
