import { Link } from 'react-router-dom';
import { eventStatusColors } from '@ds/tokens';
import { formatDate, formatStatusLabel } from '@dashboard/utils/dashboardFormatters';

function EventCard({ event }) {
  return (
    <article className="card-surface-muted flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
          <Link className="hover:text-[var(--color-brand)]" to={`/dashboard/events/${event._id}`}>
            {event.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {event.clubName || event.organizerName || 'Club event'} - {formatDate(event.startDate)}
        </p>
      </div>

      {(() => {
        const colors = eventStatusColors[event.status] ?? eventStatusColors.DRAFT;
        return (
          <span
            style={{
              background: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
            className="rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
          >
            {formatStatusLabel(event.status || 'DRAFT')}
          </span>
        );
      })()}
    </article>
  );
}

export default EventCard;
