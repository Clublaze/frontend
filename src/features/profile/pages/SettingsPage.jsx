import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import SectionLabel from '@ds/components/SectionLabel';
import InfoRow from '@ds/components/InfoRow';
import { selectUser } from '@store/authSlice';

function SettingsPage() {
  const user = useSelector(selectUser);
  const [resetSent, setResetSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    setIsSending(true);
    window.setTimeout(() => {
      setResetSent(true);
      setIsSending(false);
      toast.info('Password reset is not connected yet. Contact your administrator.');
    }, 300);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your account preferences." />

      <section className="card-surface p-6">
        <SectionLabel>Account</SectionLabel>
        <div className="mt-4 space-y-3">
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Account type" value={user?.userType?.replace(/_/g, ' ')} />
          {user?.systemId ? <InfoRow label="System ID" value={user.systemId} /> : null}
        </div>
        <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
          To update your email or system ID, contact your university administrator.
        </p>
      </section>

      <section className="card-surface p-6">
        <SectionLabel>Password</SectionLabel>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          Password reset is not connected to a backend service in this build.
        </p>
        {resetSent ? (
          <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-brand)] bg-[var(--color-brand-soft)] p-3 text-sm text-[var(--color-brand)]">
            No reset email was sent. Please contact your university administrator for password help.
          </div>
        ) : (
          <Button
            className="mt-4"
            variant="secondary"
            isLoading={isSending}
            onClick={handlePasswordReset}
          >
            Show Password Reset Guidance
          </Button>
        )}
      </section>

      <section className="card-surface border border-[var(--status-event-rejected-border)] p-6">
        <SectionLabel>Account</SectionLabel>
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          To deactivate or delete your account, please contact your university administrator or
          raise a support request from the Help page.
        </p>
      </section>
    </div>
  );
}

export default SettingsPage;
