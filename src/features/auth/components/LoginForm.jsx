import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <form
      className="w-full max-w-md p-8 rounded-2xl shadow-xl
      bg-[var(--color-neutral-900)]
      border-2 border-[var(--color-border)]"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-text-primary)]">
        Sign In
      </h2>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 px-4 py-3 rounded-lg
        bg-[var(--color-neutral-800)]
        border-2 border-[var(--color-border)]
        text-[var(--color-text-primary)] font-medium
        placeholder-[var(--color-text-muted)]
        focus:outline-none focus:ring-2
        focus:ring-[var(--color-primary-500)]"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full mb-6 px-4 py-3 rounded-lg
        bg-[var(--color-neutral-800)]
        border-2 border-[var(--color-border)]
        text-[var(--color-text-primary)] font-medium
        placeholder-[var(--color-text-muted)]
        focus:outline-none focus:ring-2
        focus:ring-[var(--color-primary-500)]"
      />

      {/* Button */}
      <button
        className="w-full py-3 rounded-lg font-bold text-white
        bg-[var(--color-primary-500)]
        hover:bg-[var(--color-primary-600)]
        transition shadow-md"
      >
        Sign In
      </button>

      {/* Signup Link */}
      <div className="mt-6 text-center">
        <span className="text-[var(--color-text-muted)] font-medium">Don't have an account? </span>
        <Link
          to="/register"
          className="text-[var(--color-primary-500)] hover:underline font-bold"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}