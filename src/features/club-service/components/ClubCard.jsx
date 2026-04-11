import Avatar from '@ds/components/Avatar';

function ClubCard({ club, meta, membershipStatus, onJoin, isJoining }) {
  if (!onJoin) {
    return (
      <article className="card-surface-muted p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              {club.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {club.type}{club.code ? ` - ${club.code}` : ''}
            </p>
          </div>

          {meta ? (
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
              {meta}
            </span>
          ) : null}
        </div>

        {club.description ? (
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
            {club.description}
          </p>
        ) : null}
      </article>
    );
  }

  const getJoinLabel = () => {
    if (membershipStatus === 'ACTIVE') return 'Joined ✓';
    if (membershipStatus === 'PENDING') return 'Applied';
    if (membershipStatus === 'REJECTED') return 'Apply Again';
    return 'Join Club';
  };

  const joinDisabled = membershipStatus === 'ACTIVE' || membershipStatus === 'PENDING' || isJoining;

  return (
    <article className="card-surface flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={club.name} size="md" />
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[var(--color-text-primary)]">
              {club.name}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {club.type}
            </p>
          </div>
        </div>

        {meta ? (
          <span className="shrink-0 rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
            {meta}
          </span>
        ) : null}
      </div>

      {club.description ? (
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--color-text-secondary)]">
          {club.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <button
        className={[
          'mt-4 w-full rounded-[var(--radius-md)] py-2.5 text-sm font-semibold transition-all duration-200',
          joinDisabled
            ? 'cursor-not-allowed border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]'
            : 'bg-[var(--color-brand)] text-[var(--color-text-inverse)] hover:brightness-105',
        ].join(' ')}
        disabled={joinDisabled}
        onClick={() => {
          if (!joinDisabled) onJoin(club._id);
        }}
        type="button"
      >
        {isJoining ? 'Submitting...' : getJoinLabel()}
      </button>
    </article>
  );
}

export default ClubCard;
