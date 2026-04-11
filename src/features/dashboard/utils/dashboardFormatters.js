const compactDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(value) {
  if (!value) {
    return 'Date not available';
  }

  return compactDateFormatter.format(new Date(value));
}

export function formatStatusLabel(value) {
  return value
    ?.toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}
