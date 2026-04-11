import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Avatar from '@ds/components/Avatar';
import StatusBadge from '@ds/components/StatusBadge';
import Modal from '@ds/components/Modal';
import Button from '@ds/components/Button';
import SectionLabel from '@ds/components/SectionLabel';
import { useMemberships } from '@club/hooks/useMemberships';
import { useLeaveClub } from '@club/hooks/useLeaveClub';
import {
  useApproveMembership,
  useRejectMembership,
} from '@club/hooks/useMembershipReview';
import { useOrganizationTree } from '@club/hooks/useDiscovery';
import { usePermission } from '@hooks/usePermission';

function MembershipsPage() {
  const dashboard = useOutletContext() ?? {};
  const [confirmLeave, setConfirmLeave] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const { can } = usePermission(dashboard.roles ?? []);
  const managedClubIds = (dashboard.managedClubs ?? []).map((role) => String(role.scopeId));
  const membershipsQuery = useMemberships({
    managedClubIds: can('MANAGE_MEMBERS') ? managedClubIds : [],
  });
  const orgTree = useOrganizationTree();
  const leaveClub = useLeaveClub();
  const approveMembership = useApproveMembership();
  const rejectMembership = useRejectMembership();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: { reason: '' },
  });

  const { byId } = orgTree.data ?? { byId: new Map() };
  const clubMembers = membershipsQuery.data?.clubMembers ?? [];
  const memberships = membershipsQuery.data?.memberships ?? [];
  const pendingMemberships = membershipsQuery.data?.pendingMemberships ?? [];
  const showLeadView = can('MANAGE_MEMBERS');

  const getClubName = (clubId) => byId.get(String(clubId))?.name ?? 'Club';
  const getSocietyName = (clubId) => {
    const club = byId.get(String(clubId));
    if (!club?.parentId) return null;
    return byId.get(String(club.parentId))?.name ?? null;
  };
  const getSchoolName = (clubId) => {
    const club = byId.get(String(clubId));
    const society = club?.parentId ? byId.get(String(club.parentId)) : null;
    const school = society?.parentId ? byId.get(String(society.parentId)) : null;
    return school?.name ?? null;
  };

  const isLoading = membershipsQuery.isLoading || orgTree.isLoading;
  const onRejectSubmit = ({ reason }) => {
    rejectMembership.mutate(
      { membershipId: rejectTarget._id, reason },
      { onSuccess: () => { setRejectTarget(null); reset(); } },
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Memberships" description="Your club memberships and their status." />

      {showLeadView ? (
        <section className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Pending Requests
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--color-text-primary)]">
              Review membership applications
            </h2>
          </div>

          {pendingMemberships.length === 0 ? (
            <EmptyState
              icon="memberships"
              title="No pending requests"
              description="New applications will appear here for club leads."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {pendingMemberships.map((membership) => (
                <article key={membership._id} className="card-surface p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                        {membership.studentName ?? membership.userName ?? 'Applicant'}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {getClubName(membership.sourceClubId ?? membership.clubId)}
                      </p>
                      {membership.applicationNote ? (
                        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                          {membership.applicationNote}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={membership.status ?? 'PENDING'} type="event" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      isLoading={approveMembership.isPending}
                      onClick={() => approveMembership.mutate(membership._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setRejectTarget(membership)}
                      style={{
                        background: 'var(--color-danger)',
                        color: 'var(--color-text-on-brand)',
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Club Members
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              {clubMembers.length ? (
                clubMembers.map((membership) => (
                  <article key={membership._id} className="card-surface-muted p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--color-text-primary)]">
                          {membership.studentName ?? membership.userName ?? 'Member'}
                        </p>
                        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                          {getClubName(membership.sourceClubId ?? membership.clubId)}
                        </p>
                      </div>
                      <StatusBadge status={membership.status ?? 'ACTIVE'} type="event" />
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState
                  icon="memberships"
                  title="No active members yet"
                  description="Approved members will appear here."
                />
              )}
            </div>
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : memberships.length === 0 ? (
        <EmptyState
          icon="memberships"
          title="No memberships yet"
          description="Explore clubs and apply to join."
        />
      ) : (
        <>
          <SectionLabel>My Clubs</SectionLabel>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {memberships.map((membership) => {
              const clubName = getClubName(membership.clubId);
              const societyName = getSocietyName(membership.clubId);
              const schoolName = getSchoolName(membership.clubId);

              const badgeConfig = {
                ACTIVE: {
                  bg: 'var(--status-event-approved-bg)',
                  text: 'var(--status-event-approved-text)',
                  border: 'var(--status-event-approved-border)',
                  label: 'Active Member',
                },
                PENDING: {
                  bg: 'var(--status-approval-pending-bg)',
                  text: 'var(--status-approval-pending-text)',
                  border: 'var(--status-approval-pending-border)',
                  label: 'Pending',
                },
                REJECTED: {
                  bg: 'var(--status-event-rejected-bg)',
                  text: 'var(--status-event-rejected-text)',
                  border: 'var(--status-event-rejected-border)',
                  label: 'Rejected',
                },
              }[membership.status] ?? {
                bg: 'var(--color-surface-soft)',
                text: 'var(--color-text-secondary)',
                border: 'var(--color-border)',
                label: membership.status,
              };

              return (
                <article key={membership._id} className="card-surface flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={clubName} size="lg" />
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {clubName}
                    </h3>
                  </div>

                  {(societyName || schoolName) && (
                    <div
                      className="space-y-0.5 border-l-2 pl-3"
                      style={{ borderColor: 'var(--color-brand)' }}
                    >
                      {societyName && (
                        <p className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>
                          {societyName}
                        </p>
                      )}
                      {schoolName && (
                        <p className="text-sm text-[var(--color-text-secondary)]">{schoolName}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
                      style={{ background: badgeConfig.bg, color: badgeConfig.text, borderColor: badgeConfig.border }}
                    >
                      {badgeConfig.label}
                    </span>

                    {membership.status === 'ACTIVE' && (
                      <button
                        type="button"
                        className="text-sm hover:underline"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => setConfirmLeave({ clubId: membership.clubId, clubName })}
                      >
                        Leave Club
                      </button>
                    )}
                  </div>

                  {membership.status === 'REJECTED' && membership.rejectionReason && (
                    <p className="text-sm italic" style={{ color: 'var(--color-danger)' }}>
                      Reason: {membership.rejectionReason}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      <Modal
        open={!!confirmLeave}
        onClose={() => setConfirmLeave(null)}
        title="Leave Club"
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Are you sure you want to leave{' '}
          <strong className="text-[var(--color-text-primary)]">
            {confirmLeave?.clubName}
          </strong>
          ? You will need to reapply to rejoin.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmLeave(null)}>Cancel</Button>
          <Button
            isLoading={leaveClub.isPending}
            onClick={() => {
              leaveClub.mutate(confirmLeave.clubId, {
                onSuccess: () => setConfirmLeave(null),
              });
            }}
            style={{
              background: 'var(--color-danger)',
              color: 'var(--color-text-on-brand)',
            }}
          >
            Leave Club
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTarget(null); reset(); }}
        title="Reject Membership"
      >
        <form onSubmit={handleSubmit(onRejectSubmit)} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">Reason</span>
            <textarea
              className="min-h-28 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-brand)]"
              placeholder="Explain why this request is being rejected..."
              {...register('reason', { required: 'Reason is required' })}
            />
            {errors.reason ? (
              <p className="text-sm text-[var(--color-danger)]">{errors.reason.message}</p>
            ) : null}
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => { setRejectTarget(null); reset(); }}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={rejectMembership.isPending}
              style={{
                background: 'var(--color-danger)',
                color: 'var(--color-text-on-brand)',
              }}
            >
              Reject Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MembershipsPage;
