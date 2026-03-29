import { useState } from "react";
import { Link } from "react-router-dom";
import VerificationNotice from "./VerificationNotice";

export default function SignupForm() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    systemId: "",
  });
  const [showVerification, setShowVerification] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally handle signup logic, then:
    setShowVerification(true);
  };

  const handleResend = () => {
    // Resend verification logic here
    alert("Verification email resent!");
  };

  const handleBack = () => {
    setShowVerification(false);
  };

  if (showVerification) {
    return (
      <VerificationNotice
        email={form.email || "your email"}
        onResend={handleResend}
        onBack={handleBack}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 rounded-2xl shadow-xl
      bg-[var(--color-neutral-900)]
      border-2 border-[var(--color-border)]"
    >
      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2 text-[var(--color-text-primary)]">
        Create an account
      </h2>

      <p className="text-sm text-center mb-6 text-[var(--color-text-muted)] font-medium">
        Join UniHub to get started
      </p>

      {/* Role Toggle */}
      <div className="flex mb-6 bg-[var(--color-neutral-800)] rounded-lg p-1 border-2 border-[var(--color-border)]">
        <button
          type="button"
          onClick={() => setRole("student")}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition ${
            role === "student"
              ? "bg-[var(--color-primary-500)] text-white shadow"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          Student
        </button>

        <button
          type="button"
          onClick={() => setRole("faculty")}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition ${
            role === "faculty"
              ? "bg-[var(--color-primary-500)] text-white shadow"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          Faculty
        </button>
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-[var(--color-text-secondary)] font-semibold">
          Email
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="you@university.edu"
          className="w-full px-4 py-3 rounded-lg
          bg-[var(--color-neutral-800)]
          border-2 border-[var(--color-border)]
          text-[var(--color-text-primary)] font-medium
          placeholder-[var(--color-text-muted)]
          focus:ring-2 focus:ring-[var(--color-primary-500)]
          outline-none"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-[var(--color-text-secondary)] font-semibold">
          Password
        </label>
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Enter password"
          className="w-full px-4 py-3 rounded-lg
          bg-[var(--color-neutral-800)]
          border-2 border-[var(--color-border)]
          text-[var(--color-text-primary)] font-medium
          placeholder-[var(--color-text-muted)]
          focus:ring-2 focus:ring-[var(--color-primary-500)]
          outline-none"
        />
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label className="block text-sm mb-1 text-[var(--color-text-secondary)] font-semibold">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          placeholder="Re-enter password"
          className="w-full px-4 py-3 rounded-lg
          bg-[var(--color-neutral-800)]
          border-2 border-[var(--color-border)]
          text-[var(--color-text-primary)] font-medium
          placeholder-[var(--color-text-muted)]
          focus:ring-2 focus:ring-[var(--color-primary-500)]
          outline-none"
        />
      </div>

      {/* System ID (Student only) */}
      {role === "student" && (
        <div className="mb-6">
          <label className="block text-sm mb-1 text-[var(--color-text-secondary)] font-semibold">
            System ID
          </label>
          <input
            type="text"
            name="systemId"
            onChange={handleChange}
            placeholder="Enter your university ID"
            className="w-full px-4 py-3 rounded-lg
            bg-[var(--color-neutral-800)]
            border-2 border-[var(--color-border)]
            text-[var(--color-text-primary)] font-medium
            placeholder-[var(--color-text-muted)]
            focus:ring-2 focus:ring-[var(--color-primary-500)]
            outline-none"
          />
        </div>
      )}

      {/* Submit */}
      <button
        className="w-full py-3 rounded-lg font-bold text-white
        bg-[var(--color-primary-500)]
        hover:bg-[var(--color-primary-600)]
        transition shadow-md"
      >
        Create Account
      </button>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <span className="text-[var(--color-text-muted)] font-medium">Already registered? </span>
        <Link
          to="/login"
          className="text-[var(--color-primary-500)] hover:underline font-bold"
        >
          Login
        </Link>
      </div>
    </form>
  );
}