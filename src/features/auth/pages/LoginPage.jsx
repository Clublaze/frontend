import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-neutral-900)' }}
    >
      <LoginForm />
    </div>
  );
}