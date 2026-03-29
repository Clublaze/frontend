import { Link } from "react-router-dom";

export default function VerificationNotice({ email, onResend, onBack }) {
  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-[var(--color-surface)] border-2 border-[var(--color-border)] flex flex-col items-center">
      <div className="mb-6 flex flex-col items-center">
        <div className="bg-[var(--color-primary-500)] bg-opacity-10 rounded-full p-4 mb-4 flex items-center justify-center" style={{ width: 80, height: 80 }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="32" fill="var(--color-primary-500)" fillOpacity="0.15" />
            <rect x="10" y="18" width="44" height="28" rx="6" fill="none" stroke="#111" strokeWidth="3.5" />
            <polyline points="10,18 32,40 54,18" fill="none" stroke="#111" strokeWidth="3.5" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-[var(--color-text-primary)] mb-2">Check your inbox</h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-1">We've sent a verification link to</p>
        <p className="text-center font-bold text-[var(--color-primary-500)] mb-4">{email}</p>
      </div>
      <div className="w-full bg-[var(--color-surface-light)] rounded-xl p-4 mb-6 border border-[var(--color-border)]">
        <p className="text-[var(--color-text-secondary)] mb-2">To verify your account:</p>
        <ol className="list-decimal list-inside text-[var(--color-text-muted)] text-sm">
          <li>Open the email from <span className="font-semibold text-[var(--color-text-primary)]">UniHub</span></li>
          <li>Click the <span className="font-semibold text-[var(--color-primary-500)]">verification link</span> in the email</li>
          <li>You'll be redirected back here automatically</li>
        </ol>
      </div>
      <div className="text-center mb-2">
        <p className="text-[var(--color-text-muted)] text-sm mb-1">Didn't receive the email?</p>
        <button
          type="button"
          onClick={onResend}
          className="text-[var(--color-primary-500)] hover:underline font-bold text-sm"
        >
          Resend verification email
        </button>
      </div>
      <p className="text-[var(--color-text-muted)] text-xs mb-4 text-center">Check your spam or junk folder if you don't see the email.</p>
      <button
        type="button"
        onClick={onBack}
        className="text-[var(--color-text-muted)] hover:underline text-sm flex items-center gap-1"
      >
        <span>&larr;</span> Back to sign up
      </button>
    </div>
  );
}
