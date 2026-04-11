import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import Button from '@ds/components/Button';
import EmptyState from '@ds/components/EmptyState';
import Loader from '@ds/components/Loader';
import Modal from '@ds/components/Modal';
import PageHeader from '@ds/components/PageHeader';
import Textarea from '@ds/components/Textarea';
import {
  useAdminUsers,
  useBlockUser,
  useUnblockUser,
  useUserLoginHistory,
} from '@auth/hooks/useAdminUsers';
import { formatDateTime, formatStatusLabel } from '@dashboard/utils/dashboardFormatters';
import { useIsAdmin } from '@hooks/usePermission';
import { selectUser } from '@store/authSlice';

const USER_TYPE_FILTERS = ['ALL', 'STUDENT', 'FACULTY', 'UNIVERSITY_ADMIN'];

const blockSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason').max(500, 'Maximum 500 characters'),
});

function StatusPill({ status }) {
  const styles = status === 'ACTIVE'
    ? {
        background: 'var(--status-approval-approved-bg)',
        borderColor: 'var(--status-approval-approved-border)',
        color: 'var(--status-approval-approved-text)',
      }
    : {
        background: 'var(--status-approval-rejected-bg)',
        borderColor: 'var(--status-approval-rejected-border)',
        color: 'var(--status-approval-rejected-text)',
      };

  return (
    <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={styles}>
      {status}
    </span>
  );
}

function AdminUsersPage() {
  const isAdmin = useIsAdmin();
  const currentUser = useSelector(selectUser);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('ALL');
  const [blockTarget, setBlockTarget] = useState(null);
  const [historyTarget, setHistoryTarget] = useState(null);
  const adminUsersQuery = useAdminUsers({
    page,
    search,
    userType: userType === 'ALL' ? undefined : userType,
  });
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const loginHistoryQuery = useUserLoginHistory(historyTarget?._id);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      reason: '',
    },
    resolver: zodResolver(blockSchema),
  });

  if (!isAdmin) {
    return <Navigate replace to="/dashboard" />;
  }

  const data = adminUsersQuery.data ?? { page: 1, totalPages: 1, users: [] };
  const users = data.users ?? [];

  const handleBlock = ({ reason }) => {
    blockUser.mutate(
      { reason, userId: blockTarget._id },
      {
        onSuccess: () => {
          setBlockTarget(null);
          reset();
        },
      },
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        description="View and manage all platform users."
        title="User Management"
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input
            className="min-h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-2 pl-9 pr-4 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)]"
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by email or system ID..."
            value={search}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {USER_TYPE_FILTERS.map((filter) => {
            const isActive = userType === filter;

            return (
              <button
                key={filter}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                onClick={() => {
                  setUserType(filter);
                  setPage(1);
                }}
                style={isActive
                  ? {
                      background: 'var(--color-brand-soft)',
                      borderColor: 'var(--color-brand)',
                      color: 'var(--color-brand)',
                    }
                  : {
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                type="button"
              >
                {filter === 'ALL' ? 'All' : filter}
              </button>
            );
          })}
        </div>
      </div>

      {adminUsersQuery.isLoading ? (
        <div className="flex justify-center py-16"><Loader size="lg" /></div>
      ) : users.length === 0 ? (
        <EmptyState
          description="Try adjusting your filters to find users."
          icon="profile"
          title="No users found"
        />
      ) : (
        <section className="card-surface overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--color-border)]">
            <thead className="bg-[var(--color-surface-soft)]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Email
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Type
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  University
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                      {formatStatusLabel(user.userType)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={user.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                    <span title={user.universityId ?? ''}>
                      {user.universityId ? String(user.universityId).slice(0, 8) : '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.status === 'ACTIVE' ? (
                        <Button
                          onClick={() => setBlockTarget(user)}
                          size="sm"
                          style={{ background: 'var(--color-danger)', color: 'var(--color-text-on-brand)' }}
                        >
                          Block
                        </Button>
                      ) : (
                        <Button
                          isLoading={unblockUser.isPending}
                          onClick={() => unblockUser.mutate({ userId: user._id })}
                          size="sm"
                          variant="secondary"
                        >
                          Unblock
                        </Button>
                      )}
                      <Button onClick={() => setHistoryTarget(user)} size="sm" variant="ghost">
                        History
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <div className="flex items-center justify-center gap-4">
        <Button disabled={page === 1} onClick={() => setPage((current) => current - 1)} size="sm" variant="secondary">
          Prev
        </Button>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Page {data.page ?? page} of {data.totalPages ?? 1}
        </p>
        <Button
          disabled={page >= (data.totalPages ?? 1)}
          onClick={() => setPage((current) => current + 1)}
          size="sm"
          variant="secondary"
        >
          Next
        </Button>
      </div>

      <Modal
        onClose={() => {
          setBlockTarget(null);
          reset();
        }}
        open={!!blockTarget}
        title="Block User"
      >
        <form className="space-y-4" onSubmit={handleSubmit(handleBlock)}>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This will block the user and revoke their active sessions.
          </p>
          <Textarea error={errors.reason?.message} label="Reason" rows={4} {...register('reason')} />
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                setBlockTarget(null);
                reset();
              }}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              isLoading={blockUser.isPending}
              style={{ background: 'var(--color-danger)', color: 'var(--color-text-on-brand)' }}
              type="submit"
            >
              Confirm Block
            </Button>
          </div>
        </form>
      </Modal>

      <Modal onClose={() => setHistoryTarget(null)} open={!!historyTarget} title="Login History">
        {loginHistoryQuery.isLoading ? (
          <div className="flex justify-center py-8"><Loader size="md" /></div>
        ) : loginHistoryQuery.isError ? (
          <p className="text-sm text-[var(--color-danger)]">
            Unable to load login history for your current admin role.
          </p>
        ) : (loginHistoryQuery.data?.logs ?? []).length ? (
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {(loginHistoryQuery.data?.logs ?? []).map((log) => (
              <article key={log._id} className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {formatDateTime(log.loginAt)}
                  </p>
                  <span
                    className="rounded-full border px-3 py-1 text-xs font-semibold"
                    style={log.success
                      ? {
                          background: 'var(--status-approval-approved-bg)',
                          borderColor: 'var(--status-approval-approved-border)',
                          color: 'var(--status-approval-approved-text)',
                        }
                      : {
                          background: 'var(--status-approval-rejected-bg)',
                          borderColor: 'var(--status-approval-rejected-border)',
                          color: 'var(--status-approval-rejected-text)',
                        }}
                  >
                    {log.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">IP: {log.ipAddress ?? 'Unknown'}</p>
                {!log.success && log.failReason ? (
                  <p className="mt-1 text-sm text-[var(--color-danger)]">{log.failReason}</p>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            description="No login attempts were found for this user."
            icon="profile"
            title="No login history"
          />
        )}
        {historyTarget && currentUser?.userType === 'UNIVERSITY_ADMIN' ? (
          <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
            University admins may not have access to all login history records.
          </p>
        ) : null}
      </Modal>
    </div>
  );
}

export default AdminUsersPage;
