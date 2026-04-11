import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '@ds/components/Loader';
import EmptyState from '@ds/components/EmptyState';
import PageHeader from '@ds/components/PageHeader';
import Button from '@ds/components/Button';
import StatusBadge from '@ds/components/StatusBadge';
import EventManagementCard from '@club/components/EventManagementCard';
import { useDiscoveryEvents } from '@club/hooks/useDiscovery';
import { useEvents } from '@club/hooks/useEvents';
import { selectUser } from '@store/authSlice';
import { usePermission } from '@hooks/usePermission';
import { formatDate } from '@dashboard/utils/dashboardFormatters';

const STATUS_FILTERS = ['ALL', 'DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];

function PublicEventCard({ event }) {
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
        <h3 className="mt-2 line-clamp-1 text-base font-semibold text-[var(--color-text-primary)]">
          <Link className="hover:text-[var(--color-brand)]" to={`/dashboard/events/${event._id}`}>
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {formatDate(event.startDate)}{event.venue ? ` - ${event.venue}` : ''}
        </p>
        {event.clubName ? (
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{event.clubName}</p>
        ) : null}
      </div>
    </article>
  );
}

function EventsPage() {
  const dashboard = useOutletContext() ?? {};
  const user = useSelector(selectUser);
  const { can } = usePermission(dashboard.roles ?? []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const canManageEvents = can('CREATE_EVENT') || can('MANAGE_MEMBERS');
  const publicEvents = useDiscoveryEvents(50);
  const myEvents = useEvents({
    enabled: canManageEvents,
    limit: 50,
    userId: user?.id,
  });

  const filterEvent = (event) =>
    !search.trim() || event.title?.toLowerCase().includes(search.toLowerCase());

  const myEventList = (myEvents.data?.createdEvents ?? [])
    .filter(filterEvent)
    .filter((event) => statusFilter === 'ALL' || event.status === statusFilter);
  const publicList = (publicEvents.data ?? []).filter(filterEvent);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Events" description="Browse and manage events across all clubs." />
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <input
            className="min-h-10 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)] sm:w-48 sm:flex-none"
            placeholder="Search events..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {can('CREATE_EVENT') ? (
            <Link to="/dashboard/events/create">
              <Button size="md">
                + Create Event
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {canManageEvents ? (
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter}
              className={[
                'border px-4',
                statusFilter === filter
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand)]'
                  : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)]',
              ].join(' ')}
              size="sm"
              variant="ghost"
              onClick={() => setStatusFilter(filter)}
            >
              {filter === 'ALL' ? 'All' : filter.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
      ) : null}

      {canManageEvents ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
            My Events
          </h2>
          {myEvents.isLoading ? (
            <div className="flex justify-center py-8"><Loader size="lg" /></div>
          ) : myEventList.length === 0 ? (
            <EmptyState
              icon="events"
              title="No events yet"
              description={can('CREATE_EVENT') ? 'Create your first event using the button above.' : 'No events found.'}
            />
          ) : (
            <div className="space-y-4">
              {myEventList.map((event) => (
                <EventManagementCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          Upcoming Events
        </h2>
        {publicEvents.isLoading ? (
          <div className="flex justify-center py-8"><Loader size="lg" /></div>
        ) : publicList.length === 0 ? (
          <EmptyState
            icon="events"
            title="No upcoming events"
            description="Approved events will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {publicList.map((event) => <PublicEventCard key={event._id} event={event} />)}
          </div>
        )}
      </section>
    </div>
  );
}

export default EventsPage;
