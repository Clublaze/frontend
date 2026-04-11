import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import ClubCard from '@club/components/ClubCard';
import { useDiscoveryClubs } from '@club/hooks/useDiscovery';
import { useMemberships } from '@club/hooks/useMemberships';
import { useJoinClub } from '@club/hooks/useJoinClub';

function ClubsPage() {
  useOutletContext();

  const [search, setSearch] = useState('');
  const clubsQuery = useDiscoveryClubs(50);
  const membershipsQuery = useMemberships();
  const joinClub = useJoinClub();

  const memberships = membershipsQuery.data?.memberships ?? [];
  const getMembershipStatus = (clubId) => {
    const membership = memberships.find((item) => String(item.clubId) === String(clubId));
    return membership?.status ?? null;
  };

  const filtered = useMemo(() => {
    const clubs = clubsQuery.data ?? [];
    if (!search.trim()) return clubs;

    return clubs.filter((club) =>
      club.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [clubsQuery.data, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Clubs" description="Browse and join clubs across all societies." />
        <input
          className="min-h-10 w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)]"
          placeholder="Search clubs..."
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {clubsQuery.isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="clubs" title="No clubs found" description="Try a different search term." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((club) => (
            <ClubCard
              key={club._id}
              club={club}
              meta={club.tags?.[0] ?? null}
              membershipStatus={getMembershipStatus(club._id)}
              onJoin={(id) => joinClub.mutate({ clubId: id })}
              isJoining={joinClub.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubsPage;
