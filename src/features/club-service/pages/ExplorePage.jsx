import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import StatusBadge from '@ds/components/StatusBadge';
import Button from '@ds/components/Button';
import ClubCard from '@club/components/ClubCard';
import SocietyCard from '@club/components/SocietyCard';
import {
  useDiscoveryClubs,
  useDiscoveryEvents,
  useDiscoverySocieties,
  useOrganizationTree,
  useSearch,
} from '@club/hooks/useDiscovery';
import { useMemberships } from '@club/hooks/useMemberships';
import { useJoinClub } from '@club/hooks/useJoinClub';
import { formatDate } from '@dashboard/utils/dashboardFormatters';

const TABS = ['Events', 'Clubs', 'Societies'];

function EventCard({ event }) {
  return (
    <article className="card-surface overflow-hidden">
      <div
        className="h-40 w-full"
        style={{
          background: event.attachments?.poster
            ? `url(${event.attachments.poster}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--color-brand-soft) 0%, var(--color-surface-soft) 100%)',
        }}
      />
      <div className="p-4">
        <StatusBadge status={event.status} type="event" />
        <h3 className="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {formatDate(event.startDate)}{event.venue ? ` - ${event.venue}` : ''}
        </p>
      </div>
    </article>
  );
}

function ExplorePage() {
  useOutletContext();

  const [activeTab, setActiveTab] = useState('Events');
  const [searchQuery, setSearchQuery] = useState('');

  const eventsQuery = useDiscoveryEvents(20);
  const clubsQuery = useDiscoveryClubs(20);
  const societiesQuery = useDiscoverySocieties();
  const orgTree = useOrganizationTree();
  const membershipsQuery = useMemberships();
  const searchResultsQuery = useSearch(searchQuery);
  const joinClub = useJoinClub();

  const memberships = membershipsQuery.data?.memberships ?? [];
  const getMembershipStatus = (clubId) => {
    const membership = memberships.find((item) => String(item.clubId) === String(clubId));
    return membership?.status ?? null;
  };

  const isSearching = searchQuery.trim().length >= 2;

  const renderSearchResults = () => {
    if (searchResultsQuery.isLoading) {
      return <Loader size="lg" />;
    }

    const results = searchResultsQuery.data;
    const resultClubs = Array.isArray(results?.clubs) ? results.clubs : (results?.clubs?.data ?? []);

    return (
      <div className="space-y-6">
        {results?.events?.length ? (
          <section>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Events
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.events.map((event) => <EventCard key={event._id} event={event} />)}
            </div>
          </section>
        ) : null}

        {resultClubs.length ? (
          <section>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Clubs
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resultClubs.map((club) => (
                <ClubCard
                  key={club._id}
                  club={club}
                  membershipStatus={getMembershipStatus(club._id)}
                  onJoin={(id) => joinClub.mutate({ clubId: id })}
                  isJoining={joinClub.isPending}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!results?.events?.length && !resultClubs.length ? (
          <EmptyState
            icon="explore"
            title="No results found"
            description={`Nothing matched "${searchQuery}"`}
          />
        ) : null}
      </div>
    );
  };

  const renderTabContent = () => {
    if (isSearching) {
      return renderSearchResults();
    }

    if (activeTab === 'Events') {
      if (eventsQuery.isLoading) {
        return <div className="flex justify-center py-12"><Loader size="lg" /></div>;
      }

      const events = eventsQuery.data ?? [];
      if (!events.length) {
        return (
          <EmptyState
            icon="events"
            title="No upcoming events"
            description="Check back soon for approved events."
          />
        );
      }

      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      );
    }

    if (activeTab === 'Clubs') {
      if (clubsQuery.isLoading) {
        return <div className="flex justify-center py-12"><Loader size="lg" /></div>;
      }

      const clubs = clubsQuery.data ?? [];
      if (!clubs.length) {
        return (
          <EmptyState
            icon="clubs"
            title="No clubs found"
            description="Clubs will appear here once they are published."
          />
        );
      }

      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clubs.map((club) => (
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
      );
    }

    if (activeTab === 'Societies') {
      if (societiesQuery.isLoading) {
        return <div className="flex justify-center py-12"><Loader size="lg" /></div>;
      }

      const societies = societiesQuery.data ?? [];
      const { byId, units } = orgTree.data ?? { byId: new Map(), units: [] };
      if (!societies.length) {
        return <EmptyState icon="societies" title="No societies found" />;
      }

      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {societies.map((society) => {
            const parent = byId.get(String(society.parentId));
            const childClubs = units.filter(
              (unit) => String(unit.parentId) === String(society._id) && unit.type === 'CLUB',
            );

            return (
              <SocietyCard
                key={society._id}
                society={society}
                childClubs={childClubs}
                schoolName={parent?.name ?? ''}
              />
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Explore"
          description="Discover events, clubs, and societies across the university."
        />
        <input
          className="min-h-10 w-full max-w-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)]"
          placeholder="Search..."
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {!isSearching ? (
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab}
              className={[
                'border px-4 py-2',
                activeTab === tab
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]'
                  : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
              ].join(' ')}
              onClick={() => setActiveTab(tab)}
              size="sm"
              variant="ghost"
            >
              {tab}
            </Button>
          ))}
        </div>
      ) : null}

      {renderTabContent()}
    </div>
  );
}

export default ExplorePage;
