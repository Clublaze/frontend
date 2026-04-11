import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import { useDiscoveryEvents, useOrganizationTree } from '@club/hooks/useDiscovery';

function RankBadge({ rank }) {
  const rankStyles = {
    1: {
      background: 'var(--status-approval-pending-text)',
      color: 'var(--color-text-inverse)',
    },
    2: {
      background: 'var(--color-text-secondary)',
      color: 'var(--color-text-inverse)',
    },
    3: {
      background: 'var(--status-event-review-border)',
      color: 'var(--color-text-on-brand)',
    },
  };

  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
      style={rankStyles[rank] ?? {
        background: 'var(--color-surface-soft)',
        color: 'var(--color-text-secondary)',
      }}
    >
      {rank}
    </span>
  );
}

function LeaderboardPage() {
  useOutletContext();

  const eventsQuery = useDiscoveryEvents(100);
  const orgTree = useOrganizationTree();

  const isLoading = eventsQuery.isLoading || orgTree.isLoading;
  const { units, byId } = orgTree.data ?? { units: [], byId: new Map() };

  const rankings = useMemo(() => {
    const events = eventsQuery.data ?? [];
    const clubs = units.filter((unit) => unit.type === 'CLUB');
    const eventCountByClub = events.reduce((accumulator, event) => {
      const id = String(event.organizingClubId);
      accumulator[id] = (accumulator[id] ?? 0) + 1;
      return accumulator;
    }, {});

    return clubs
      .map((club) => {
        const count = eventCountByClub[String(club._id)] ?? 0;
        const society = club.parentId ? byId.get(String(club.parentId)) : null;
        const school = society?.parentId ? byId.get(String(society.parentId)) : null;

        return {
          _id: club._id,
          name: club.name,
          schoolName: school?.name ?? '-',
          score: count * 500,
          societyName: society?.name ?? '-',
        };
      })
      .sort((left, right) => right.score - left.score);
  }, [byId, eventsQuery.data, units]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leaderboard"
        description="Top performing clubs ranked by activity and engagement."
      />

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader size="lg" /></div>
      ) : rankings.length === 0 ? (
        <EmptyState
          icon="leaderboard"
          title="No data yet"
          description="Rankings will appear once clubs start organising events."
        />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Rank', 'Club', 'Society', 'School', 'Points'].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankings.map((club, index) => (
                <tr
                  key={club._id}
                  className="border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-soft)]"
                >
                  <td className="px-4 py-4">
                    <RankBadge rank={index + 1} />
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
                    {club.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-secondary)]">
                    {club.societyName}
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--color-text-secondary)]">
                    {club.schoolName}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-[var(--color-brand)]">
                    {club.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;
