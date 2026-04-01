import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@ds/components/Button';
import { useVerifyEmail } from '@auth/hooks/useVerifyEmail';

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';
  const emailHint = searchParams.get('email');
  const verifyEmailMutation = useVerifyEmail();
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    if (tokenFromUrl && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      verifyEmailMutation.mutate({ token: tokenFromUrl });
    }
  }, [tokenFromUrl, verifyEmailMutation]);

  if (verifyEmailMutation.isPending) {
    return (
      <section className="card-surface auth-card text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Verifying your email...</h2>
      </section>
    );
  }

  if (verifyEmailMutation.isSuccess) {
    return (
      <section className="card-surface auth-card text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Email verified successfully.</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Your account is ready. You can now log in.
        </p>
        <div className="mt-6">
          <Button className="w-full sm:w-auto" onClick={() => navigate('/login')} size="lg" type="button">
            Go to Login
          </Button>
        </div>
      </section>
    );
  }

  if (!tokenFromUrl) {
    return (
      <section className="card-surface auth-card text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Verify your email</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          {emailHint
            ? `A verification link was sent to ${emailHint}. Please check your inbox and verify your email.`
            : 'A verification link was sent to your email. Please check your inbox and verify your email.'}
        </p>
      </section>
    );
  }

  if (verifyEmailMutation.isError) {
    return (
      <section className="card-surface auth-card text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Verification failed.</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          We could not verify your email token.
          {emailHint ? ` A verification message was sent to ${emailHint}.` : ''}
        </p>
        <div className="mt-6">
          <Button
            className="w-full sm:w-auto"
            isLoading={verifyEmailMutation.isPending}
            onClick={() => verifyEmailMutation.mutate({ token: tokenFromUrl })}
            size="lg"
            type="button"
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="card-surface auth-card text-center">
      <h2 className="auth-heading font-semibold tracking-tight">Verify your email</h2>
      <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
        Preparing your verification request...
      </p>
    </section>
  );
}

export default VerifyEmailPage;
