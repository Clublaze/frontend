// Format a date → "12 Mar 2026"
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

// How many days until a date from today
export const daysUntil = (date) =>
  Math.floor((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))

// Is the date already past?
export const isPast = (date) => new Date(date) < new Date()

// Format for HTML date input (YYYY-MM-DD)
export const toInputDate = (date) =>
  new Date(date).toISOString().split('T')[0]

// Format with time → "12 Mar 2026, 3:30 PM"
export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })