import SignupForm from "../components/SignupForm";

export function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-neutral-900)' }}
    >
      <SignupForm />
    </div>
  );
}