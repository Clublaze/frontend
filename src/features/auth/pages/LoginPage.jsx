import LoginForm from '@auth/components/LoginForm';

function LoginPage() {
  return (
    <section className="auth-card">
      <div className="text-center">
        <h2 className="auth-heading font-semibold tracking-tight">Welcome back</h2>
        <p className="auth-body-copy mt-3 text-[var(--color-text-secondary)]">
          Sign in to your UniHub account
        </p>
      </div>

      <div className="mt-6 sm:mt-8">
        <LoginForm />
      </div>
    </section>
  );
}

export default LoginPage;
