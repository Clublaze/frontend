import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListRow from '@ds/components/ListRow';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import {
  getGreetingLabel,
  getUserDisplayName,
  getUserInitials,
} from '@dashboard/utils/userPresentation';
import { logout } from '@auth/logout';
import { useNotifications } from '@hooks/useNotifications';

function Navbar({ dashboard, isDesktop, onMenuToggle }) {
  const user = dashboard?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [activeViewRole, setActiveViewRole] = useState(null);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const roleDropdownRef = useRef(null);
  const notifications = useNotifications(dashboard);
  const notificationCount = Math.min(notifications.count, 9);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }

      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ADMIN_TYPES = ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
  const isAdmin = ADMIN_TYPES.includes(user?.userType);

  const ROLE_PRIORITY = [
    'DEAN', 'HOD', 'FACULTY_ADVISOR', 'PRESIDENT', 'VICE_PRESIDENT',
    'SECRETARY', 'CLUB_LEAD', 'CO_LEAD', 'COORDINATOR',
  ];

  const allActiveRoles = (dashboard?.roles ?? [])
    .filter((role) => role.status !== 'REMOVED');

  const currentRoleLabel = (() => {
    if (isAdmin) return 'Admin';
    if (activeViewRole) return formatCanonicalRole(activeViewRole);
    const match = ROLE_PRIORITY.find((priorityRole) =>
      allActiveRoles.some((role) => role.canonicalRole === priorityRole)
    );
    if (match) return formatCanonicalRole(match);
    return user?.userType === 'FACULTY' ? 'Faculty' : 'Student';
  })();

  const showRoleToast = (label) => {
    toast.info(
      <div>
        <p style={{ fontWeight: 600 }}>Role switched</p>
        <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Now viewing as {label}</p>
      </div>,
      {
        position: 'bottom-right',
        autoClose: 2000,
        style: {
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-primary)',
        },
      },
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-dark)_80%,var(--color-background)_20%)]">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {!isDesktop ? (
            <button
              aria-label="Open sidebar"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              onClick={onMenuToggle}
              type="button"
            >
              <Menu className="h-[18px] w-[18px]" strokeWidth={2} />
            </button>
          ) : null}

          {!isDesktop ? (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[var(--color-brand)] text-base font-semibold text-[var(--color-text-on-brand)] shadow-[var(--shadow-card)]">
                U
              </div>
              <p className="truncate text-[1.35rem] font-semibold leading-none text-[var(--color-text-primary)]">
                UniHub
              </p>
            </div>
          ) : (
            <p className="truncate text-[1.05rem] font-semibold text-[var(--color-text-primary)] sm:text-[1.1rem]">
              {getGreetingLabel()}, {getUserDisplayName(user)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative" ref={roleDropdownRef}>
            <button
              type="button"
              onClick={() => setRoleDropdownOpen((current) => !current)}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface)]"
            >
              {currentRoleLabel}
              <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute left-0 top-10 z-50 min-w-[160px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-card)]">
                <div className="border-b border-[var(--color-border)] px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                    Switch view
                  </p>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                    onClick={() => {
                      setActiveViewRole('ADMIN');
                      setRoleDropdownOpen(false);
                      showRoleToast('Admin');
                    }}
                  >
                    Admin
                  </button>
                )}

                {allActiveRoles.map((role) => (
                  <button
                    key={role._id}
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                    onClick={() => {
                      setActiveViewRole(role.canonicalRole);
                      setRoleDropdownOpen(false);
                      const label = formatCanonicalRole(role.canonicalRole);
                      showRoleToast(label);
                    }}
                  >
                    {formatCanonicalRole(role.canonicalRole)}
                    <span className="ml-2 text-xs text-[var(--color-text-secondary)]">
                      {role.scopeType}
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                  onClick={() => {
                    setActiveViewRole(null);
                    setRoleDropdownOpen(false);
                    const label = user?.userType === 'FACULTY' ? 'Faculty' : 'Student';
                    showRoleToast(label);
                  }}
                >
                  {user?.userType === 'FACULTY' ? 'Faculty' : 'Student'}
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={notificationsRef}>
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              type="button"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <Bell className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {notificationCount > 0 ? (
                <span className="absolute right-2 top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-brand)] px-1 text-[10px] font-semibold text-[var(--color-text-inverse)]">
                  {notificationCount}
                </span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[min(24rem,calc(100vw-1.5rem))] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-card)]">
                <div className="border-b border-[var(--color-border)] px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">Notifications</p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                    Recent activity relevant to you
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto p-2">
                  {notifications.items.length ? (
                    notifications.items.map((item) => (
                      <ListRow
                        key={item.id}
                        badge={item.badge}
                        href={item.href}
                        onClick={() => setNotificationsOpen(false)}
                        subtitle={item.subtitle}
                        title={item.title}
                      />
                    ))
                  ) : (
                    <div className="px-3 py-6 text-center text-sm text-[var(--color-text-secondary)]">
                      You&apos;re all caught up.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              aria-label="User menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-brand)_18%,transparent)] text-sm font-semibold text-[var(--color-brand)] transition-opacity hover:opacity-80"
              onClick={() => setDropdownOpen((current) => !current)}
              type="button"
            >
              {getUserInitials(user)}
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 top-12 z-50 w-48 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-card)]">
                <div className="border-b border-[var(--color-border)] px-4 py-3">
                  <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                    {getUserDisplayName(user)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
                    {user?.email}
                  </p>
                </div>

                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>

                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>

                <div className="border-t border-[var(--color-border)] pt-1">
                  <button
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-danger)] transition-colors hover:bg-[var(--status-event-rejected-bg)]"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    type="button"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
