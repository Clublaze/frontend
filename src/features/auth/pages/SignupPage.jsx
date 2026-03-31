import SignupForm from '@auth/components/SignupForm';

function SignupPage() {
  return (
    <section className="card-surface auth-card">
      <div className="text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Create an account</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Join UniHub to get started
        </p>
      </div>

      <div className="mt-6 sm:mt-8">
        <SignupForm />
      </div>
    </section>
  );
}

export default SignupPage;
