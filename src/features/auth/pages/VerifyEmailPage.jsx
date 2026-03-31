import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import { useVerifyEmail } from '@auth/hooks/useVerifyEmail';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';
  const emailHint = searchParams.get('email');
  const verifyEmailMutation = useVerifyEmail();
  const hasAutoSubmitted = useRef(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      token: tokenFromUrl,
    },
  });

  const tokenValue = useWatch({
    control,
    name: 'token',
  });

  useEffect(() => {
    if (tokenFromUrl && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      setValue('token', tokenFromUrl);
      verifyEmailMutation.mutate({ token: tokenFromUrl });
    }
  }, [setValue, tokenFromUrl, verifyEmailMutation]);

  return (
    <section className="card-surface auth-card">
      <div className="text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Verify your email</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Paste the token from your inbox to finish setup.
          {emailHint ? ` A verification message was sent to ${emailHint}.` : ''}
        </p>
      </div>

      <form
        className="mt-6 space-y-5 sm:mt-8"
        onSubmit={handleSubmit(({ token }) => {
          if (!token.trim()) {
            return;
          }

          verifyEmailMutation.mutate({ token });
        })}
      >
        <Input
          error={errors.token?.message}
          label="Verification Token"
          placeholder="Paste your email verification token"
          {...register('token', {
            required: 'Verification token is required',
          })}
        />

        <Button
          className="w-full"
          disabled={!tokenValue?.trim()}
          isLoading={verifyEmailMutation.isPending}
          size="lg"
          type="submit"
        >
          Verify Email
        </Button>
      </form>

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm leading-6 text-[var(--color-success)]">
        Once verification succeeds, you can return to the login page and sign in normally.
      </div>

      <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
        Ready to continue?{' '}
        <Link className="font-semibold text-[var(--color-brand)]" to="/login">
          Go to login
        </Link>
      </p>
    </section>
  );
}

export default VerifyEmailPage;
