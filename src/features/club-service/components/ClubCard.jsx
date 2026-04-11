import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@ds/components/Avatar';
import Button from '@ds/components/Button';

function ClubCard({ club, meta, membershipStatus, onJoin, isJoining, orgTree }) {
  const navigate = useNavigate();
  const societyName = (() => {
    if (!orgTree || !club.parentId) return null;
    const parent = orgTree.byId?.get(String(club.parentId));
    return parent?.name ?? null;
  })();

  const schoolName = (() => {
    if (!orgTree || !club.parentId) return null;
    const society = orgTree.byId?.get(String(club.parentId));
    if (!society?.parentId) return null;
    const school = orgTree.byId?.get(String(society.parentId));
    return school?.name ?? null;
  })();

  const getJoinLabel = () => {
    if (membershipStatus === 'ACTIVE') return 'Joined';
    if (membershipStatus === 'PENDING') return 'Applied';
    if (membershipStatus === 'REJECTED') return 'Apply Again';
    return 'Join Club';
  };

  const joinDisabled = membershipStatus === 'ACTIVE' || membershipStatus === 'PENDING' || isJoining;

  if (!onJoin) {
    return (
      <article className="card-surface-muted p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{club.name}</h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {club.type}{club.code ? ` · ${club.code}` : ''}
            </p>
          </div>
          {meta ? (
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
              {meta}
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <Button onClick={() => navigate(`/dashboard/clubs/${club._id}`)} size="sm" variant="ghost">
            View Profile
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article className="card-surface flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <Avatar name={club.name} size="lg" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{club.name}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {club.memberCount ?? meta ?? '-'} members
          </p>
        </div>
      </div>

      {(societyName || schoolName) ? (
        <div className="space-y-0.5 border-l-2 pl-3" style={{ borderColor: 'var(--color-brand)' }}>
          {societyName ? (
            <p className="text-sm font-medium" style={{ color: 'var(--color-brand)' }}>
              {societyName}
            </p>
          ) : null}
          {schoolName ? <p className="text-sm text-[var(--color-text-secondary)]">{schoolName}</p> : null}
        </div>
      ) : null}

      {club.description ? (
        <p className="line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">
          {club.description}
        </p>
      ) : null}

      <div className="mt-auto space-y-3">
        <Button
          className="w-full gap-2"
          disabled={joinDisabled}
          isLoading={isJoining && !joinDisabled}
          onClick={() => {
            if (!joinDisabled) onJoin(club._id);
          }}
          variant={joinDisabled ? 'secondary' : 'primary'}
        >
          <Users className="h-4 w-4" />
          {isJoining ? 'Submitting...' : getJoinLabel()}
        </Button>

        <Button className="w-full" onClick={() => navigate(`/dashboard/clubs/${club._id}`)} variant="ghost">
          View Profile
        </Button>
      </div>
    </article>
  );
}

export default ClubCard;
