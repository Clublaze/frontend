import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarEvents } from '@club/hooks/useCalendarEvents';
import { formatStatusLabel } from '@dashboard/utils/dashboardFormatters';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const STATUS_DOT_COLORS = {
  DRAFT: 'var(--status-event-draft-text)',
  UNDER_REVIEW: 'var(--status-event-review-text)',
  APPROVED: 'var(--status-event-approved-text)',
  REJECTED: 'var(--status-event-rejected-text)',
  ECR_PENDING: 'var(--status-event-ecr-text)',
  CLOSED: 'var(--status-event-closed-text)',
};

const STATUS_DOT_BG = {
  DRAFT: 'var(--status-event-draft-bg)',
  UNDER_REVIEW: 'var(--status-event-review-bg)',
  APPROVED: 'var(--status-event-approved-bg)',
  REJECTED: 'var(--status-event-rejected-bg)',
  ECR_PENDING: 'var(--status-event-ecr-bg)',
  CLOSED: 'var(--status-event-closed-bg)',
};

export default function CalendarPanel() {
  const navigate = useNavigate();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const { eventsByDate, isLoading } = useCalendarEvents(viewYear, viewMonth);

  const todayKey = today.toISOString().slice(0, 10);
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstDayOfMonth }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const selectedDayKey = selectedDay === null
    ? null
    : `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  const selectedEvents = selectedDayKey ? (eventsByDate[selectedDayKey] ?? []) : [];

  function getDayKey(day) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function getDotsForDay(day) {
    const key = getDayKey(day);
    const events = eventsByDate[key] ?? [];
    return [...new Set(events.map((event) => event.status))].slice(0, 3);
  }

  function isToday(day) {
    return getDayKey(day) === todayKey;
  }

  function isSelected(day) {
    return selectedDay === day;
  }

  function handleDayClick(day) {
    setSelectedDay((prev) => (prev === day ? null : day));
  }

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }

    setSelectedDay(null);
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }

    setSelectedDay(null);
  }

  return (
    <div
      className="mx-3 rounded-[var(--radius-lg)] border border-[var(--color-border)]"
      style={{ background: 'color-mix(in srgb, var(--color-surface) 80%, transparent)' }}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2.5">
        <button
          className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-soft)]"
          onClick={goToPrevMonth}
          style={{ color: 'var(--color-text-secondary)' }}
          type="button"
        >
          <ChevronLeft className="h-3 w-3" strokeWidth={2.5} />
        </button>

        <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>

        <button
          className="inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-soft)]"
          onClick={goToNextMonth}
          style={{ color: 'var(--color-text-secondary)' }}
          type="button"
        >
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-7 px-2 pb-1 pt-2">
        {DAY_LABELS.map((label) => (
          <div
            className="text-center text-[9px] font-semibold uppercase tracking-wide"
            key={label}
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {label}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex h-20 items-center justify-center">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-solid"
            style={{
              color: 'var(--color-brand)',
              borderColor: 'transparent',
              borderTopColor: 'currentColor',
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-y-1 px-2 pb-2">
          {cells.map((cell, index) => {
            if (cell === null) {
              return <div key={`empty-${index}`} />;
            }

            const dots = getDotsForDay(cell);
            const todayBool = isToday(cell);
            const selectedBool = isSelected(cell);
            const hasEvents = dots.length > 0;

            return (
              <button
                className={[
                  'relative flex min-h-[28px] w-full flex-col items-center justify-start rounded-[var(--radius-sm)] py-0.5 transition-all duration-150',
                  selectedBool ? '' : 'hover:bg-[var(--color-surface-soft)]',
                ].join(' ')}
                key={cell}
                onClick={() => handleDayClick(cell)}
                style={{
                  background: selectedBool
                    ? 'var(--color-brand)'
                    : todayBool
                      ? 'color-mix(in srgb, var(--color-brand) 18%, transparent)'
                      : 'transparent',
                }}
                type="button"
              >
                <span
                  className="text-[11px] font-medium leading-5"
                  style={{
                    color: selectedBool
                      ? 'var(--color-text-on-brand)'
                      : todayBool
                        ? 'var(--color-brand)'
                        : 'var(--color-text-primary)',
                  }}
                >
                  {cell}
                </span>

                {hasEvents ? (
                  <div className="mt-0.5 flex items-center justify-center gap-px">
                    {dots.map((status, dotIndex) => (
                      <span
                        className="h-1 w-1 rounded-full"
                        key={`${status}-${dotIndex}`}
                        style={{
                          background: selectedBool
                            ? 'color-mix(in srgb, var(--color-text-on-brand) 75%, transparent)'
                            : STATUS_DOT_COLORS[status] ?? 'var(--color-brand)',
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {selectedDay !== null ? (
        <div
          className="mx-1 mt-0 border-t border-[var(--color-border)]"
          style={{ maxHeight: '160px', overflowY: 'auto' }}
        >
          <p
            className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {MONTH_NAMES[viewMonth].slice(0, 3)} {selectedDay}
          </p>

          {selectedEvents.length === 0 ? (
            <p
              className="px-2 pb-2 text-center text-[11px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              No events
            </p>
          ) : (
            <div className="space-y-1 px-1 pb-1.5">
              {selectedEvents.map((event) => (
                <button
                  className="w-full rounded-[var(--radius-sm)] px-2 py-1.5 text-left transition-colors hover:bg-[var(--color-surface-soft)]"
                  key={String(event._id)}
                  onClick={() => navigate(`/dashboard/events/${String(event._id)}`)}
                  type="button"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: STATUS_DOT_COLORS[event.status] ?? 'var(--color-brand)',
                        boxShadow: `0 0 0 3px ${STATUS_DOT_BG[event.status] ?? 'transparent'}`,
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-[11px] font-semibold leading-tight"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {event.title}
                      </p>
                      <p
                        className="mt-0.5 truncate text-[10px]"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {formatStatusLabel(event.status)}
                        {event.venue ? ` · ${event.venue}` : ''}
                        {event.category ? ` · ${event.category.replace(/_/g, ' ')}` : ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
