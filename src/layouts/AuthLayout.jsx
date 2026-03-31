import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <main className="flex min-h-screen min-h-dvh items-start justify-center px-4 py-6 sm:px-6 sm:py-10 md:items-center">
      <div className="w-full max-w-xl">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--color-border)] bg-[var(--color-brand-soft)] text-xl font-bold text-[var(--color-brand)] shadow-[0_16px_36px_-24px_rgba(33,199,183,0.75)] sm:h-16 sm:w-16 sm:rounded-[20px] sm:text-2xl">
            UH
          </div>
          <h1 className="mt-4 text-[clamp(2.25rem,7vw,3rem)] font-semibold tracking-tight text-[var(--color-brand)] sm:mt-5">
            UniHub
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--color-text-secondary)] sm:text-lg">
            University Management Platform
          </p>
        </div>

        <Outlet />

        <p className="mx-auto mt-6 max-w-md px-2 text-center text-xs leading-6 text-[var(--color-text-secondary)] sm:mt-8 sm:text-sm">
          By continuing, you agree to UniHub&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}

export default AuthLayout;
