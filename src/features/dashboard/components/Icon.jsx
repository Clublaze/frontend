const commonProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
  viewBox: '0 0 24 24',
};

function Svg({ children, className = 'h-5 w-5', ...props }) {
  return (
    <svg aria-hidden="true" className={className} {...commonProps} {...props}>
      {children}
    </svg>
  );
}

function Icon({ name, className }) {
  switch (name) {
    case 'dashboard':
      return (
        <Svg className={className}>
          <rect height="7" rx="1.5" width="7" x="3" y="3" />
          <rect height="7" rx="1.5" width="7" x="14" y="3" />
          <rect height="7" rx="1.5" width="7" x="3" y="14" />
          <rect height="7" rx="1.5" width="7" x="14" y="14" />
        </Svg>
      );
    case 'explore':
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-4.2 8.1-2.8-4.2 7-3.9Z" />
        </Svg>
      );
    case 'events':
      return (
        <Svg className={className}>
          <rect height="16" rx="2.5" width="16" x="4" y="5" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </Svg>
      );
    case 'clubs':
      return (
        <Svg className={className}>
          <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M16 13a3 3 0 1 0 0-6" />
          <path d="M3 20a5 5 0 0 1 10 0" />
          <path d="M14 20a4 4 0 0 1 7 0" />
        </Svg>
      );
    case 'societies':
      return (
        <Svg className={className}>
          <path d="M6 4h9l3 3v13H6Z" />
          <path d="M15 4v4h4M9 11h6M9 15h6M9 19h4" />
        </Svg>
      );
    case 'approvals':
      return (
        <Svg className={className}>
          <rect height="16" rx="2.5" width="14" x="5" y="4" />
          <path d="m9 12 2 2 4-4M9 3h6" />
        </Svg>
      );
    case 'memberships':
      return (
        <Svg className={className}>
          <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M16 10a3 3 0 1 0 0-6" />
          <path d="M2.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M15 18a4.5 4.5 0 0 1 6.5 2" />
        </Svg>
      );
    case 'audit':
      return (
        <Svg className={className}>
          <path d="M12 3 5 6v6c0 4.2 2.7 7.9 7 9 4.3-1.1 7-4.8 7-9V6l-7-3Z" />
        </Svg>
      );
    case 'governance':
      return (
        <Svg className={className}>
          <path d="M6 4h9l3 3v13H6Z" />
          <path d="M15 4v4h4M9 12h6M9 16h6" />
        </Svg>
      );
    case 'leaderboard':
      return (
        <Svg className={className}>
          <path d="M8 21V11M16 21v-6M12 21V7" />
          <path d="M6 3h12v3a4 4 0 0 1-4 4h-4A4 4 0 0 1 6 6V3Z" />
        </Svg>
      );
    case 'profile':
      return (
        <Svg className={className}>
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </Svg>
      );
    case 'settings':
      return (
        <Svg className={className}>
          <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" />
          <path d="m19 12 2-1-1-3-2 .3-1.2-1.8 1-1.8-2.7-1.6L13.8 5h-2.6L10 2.9 7.3 4.5l1 1.8L7.1 8.1 5 7.8l-1 3 2 1v.4l-2 1 1 3 2.1-.3 1.2 1.8-1 1.8 2.7 1.6 1.2-2.1h2.6l1.3 2.1 2.7-1.6-1-1.8 1.2-1.8 2.1.3 1-3-2-1V12Z" />
        </Svg>
      );
    case 'help':
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.1 9a3 3 0 1 1 4.8 2.4c-.9.7-1.4 1.2-1.4 2.1" />
          <path d="M12 17h.01" />
        </Svg>
      );
    case 'menu':
      return (
        <Svg className={className}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </Svg>
      );
    case 'close':
      return (
        <Svg className={className}>
          <path d="m6 6 12 12M18 6 6 18" />
        </Svg>
      );
    case 'bell':
      return (
        <Svg className={className}>
          <path d="M15 17H9l-1 1h8l-1-1Z" />
          <path d="M18 16H6l1.2-1.8c.5-.8.8-1.8.8-2.8v-1a4 4 0 0 1 8 0v1c0 1 .3 2 .8 2.8L18 16Z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </Svg>
      );
    case 'arrowRight':
      return (
        <Svg className={className}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </Svg>
      );
    default:
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="8" />
        </Svg>
      );
  }
}

export default Icon;
