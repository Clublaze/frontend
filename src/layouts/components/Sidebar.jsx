import * as Dialog from '@radix-ui/react-dialog';
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  ClipboardCheck,
  Compass,
  LayoutGrid,
  Settings,
  Shield,
  Trophy,
  UserRound,
  Users,
  UsersRound,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  accountNavigationItems,
  mainNavigationItems,
} from '@dashboard/config/navigation';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { usePermission } from '@hooks/usePermission';
import {
  getUserDisplayName,
  getUserInitials,
} from '@dashboard/utils/userPresentation';

const iconMap = {
  approvals: ClipboardCheck,
  audit: Shield,
  clubs: UsersRound,
  dashboard: LayoutGrid,
  events: CalendarDays,
  explore: Compass,
  governance: BadgeCheck,
  help: CircleHelp,
  leaderboard: Trophy,
  memberships: Users,
  profile: UserRound,
  settings: Settings,
  societies: Building2,
};

function BrandMark({ compact = false }) {
  return (
    <div
      className={[
        'flex shrink-0 items-center justify-center rounded-[16px] bg-[var(--gradient-brand-mark)] font-semibold text-[var(--color-text-on-brand)] shadow-[var(--shadow-brand-mark)]',
        compact ? 'h-10 w-10 text-base' : 'h-11 w-11 text-lg',
      ].join(' ')}
    >
      U
    </div>
  );
}

function SidebarLink({ collapsed, icon, label, onNavigate, to }) {
  const LinkIcon = iconMap[icon] ?? LayoutGrid;

  return (
    <NavLink
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-[18px] transition-all duration-200',
          collapsed ? 'justify-center px-3 py-3' : 'gap-3 px-4 py-3',
          isActive
            ? 'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-brand)_11%,transparent)_0%,color-mix(in_srgb,var(--color-brand)_8%,transparent)_100%)] text-[var(--color-brand)]'
            : 'text-[color-mix(in_srgb,var(--color-text-secondary)_92%,var(--color-text-primary)_8%)] hover:bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)] hover:text-[var(--color-text-primary)]',
        ].join(' ')
      }
      end={to === '/dashboard'}
      onClick={onNavigate}
      to={to}
    >
      {() => (
        <>
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-current">
            <LinkIcon className="h-[18px] w-[18px]" strokeWidth={1.9} />
          </span>
          {!collapsed ? <span className="truncate text-[0.98rem] font-medium">{label}</span> : null}
        </>
      )}
    </NavLink>
  );
}

function SidebarSection({ can, collapsed, items, onNavigate, title }) {
  const visibleItems = items.filter((item) => item.permission === null || can(item.permission));

  return (
    <section>
      {!collapsed ? (
        <p className="px-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[color-mix(in_srgb,var(--color-text-secondary)_88%,var(--color-text-primary)_12%)]">
          {title}
        </p>
      ) : null}
      <div className={collapsed ? 'space-y-2.5' : 'mt-4 space-y-1.5'}>
        {visibleItems.map((item) => (
          <SidebarLink
            collapsed={collapsed}
            key={item.label}
            onNavigate={onNavigate}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}

function SidebarShell({
  collapsed,
  dashboard,
  onNavigate,
  onToggleDesktop,
  showDesktopToggle = true,
}) {
  const user = dashboard?.user;
  const roleLabel = dashboard?.roles?.[0]
    ? formatCanonicalRole(dashboard.roles[0].canonicalRole)
    : ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'].includes(user?.userType)
      ? 'Administrator'
      : user?.userType === 'FACULTY'
        ? 'Faculty Member'
        : 'Campus Member';
  const { can } = usePermission(dashboard?.roles ?? []);

  return (
    <div
      className={[
        'flex h-full flex-col border-r border-[var(--color-border)] bg-[var(--gradient-sidebar)]',
        collapsed ? 'w-[84px]' : 'w-[320px]',
      ].join(' ')}
    >
      <div
        className={[
          'border-b border-[var(--color-border)]',
          collapsed ? 'px-3 py-4' : 'px-5 py-5',
        ].join(' ')}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <BrandMark compact />
            {showDesktopToggle ? (
              <button
                aria-label="Expand sidebar"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[color-mix(in_srgb,var(--color-text-secondary)_92%,var(--color-text-primary)_8%)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                onClick={onToggleDesktop}
                type="button"
              >
                <ChevronsRight className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark />
              <div className="min-w-0">
                <p className="truncate text-[1rem] font-semibold text-[var(--color-text-primary)]">
                  UniHub
                </p>
              </div>
            </div>

            {showDesktopToggle ? (
              <button
                aria-label="Collapse sidebar"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[color-mix(in_srgb,var(--color-text-secondary)_92%,var(--color-text-primary)_8%)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                onClick={onToggleDesktop}
                type="button"
              >
                <ChevronsLeft className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div className={['flex-1 overflow-y-auto', collapsed ? 'px-3 py-6' : 'px-4 py-8'].join(' ')}>
        <div className="space-y-9">
          <SidebarSection
            can={can}
            collapsed={collapsed}
            items={mainNavigationItems}
            onNavigate={onNavigate}
            title="Main Menu"
          />
          <SidebarSection
            can={can}
            collapsed={collapsed}
            items={accountNavigationItems}
            onNavigate={onNavigate}
            title="Account"
          />
        </div>
      </div>

      <div className={collapsed ? 'px-2 pb-3 pt-2' : 'p-4'}>
        <div
          className={[
            'rounded-[22px] border border-[color-mix(in_srgb,var(--color-border)_90%,var(--color-background)_10%)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_92%,transparent)_0%,color-mix(in_srgb,var(--color-surface-dark)_88%,transparent)_100%)]',
            collapsed ? 'p-2.5' : 'p-3.5',
          ].join(' ')}
        >
          <div className={collapsed ? 'flex justify-center' : 'flex items-center gap-3'}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gradient-brand-mark)] text-sm font-semibold text-[var(--color-text-on-brand)] shadow-[var(--shadow-user-avatar)]">
              {getUserInitials(user)}
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-[1rem] font-semibold text-[var(--color-text-primary)]">
                  {getUserDisplayName(user)}
                </p>
                <p className="mt-0.5 text-[0.92rem] text-[var(--color-text-secondary)]">{roleLabel}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileSidebar({ dashboard, onClose }) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-[var(--color-overlay)] backdrop-blur-[2px] lg:hidden" />
      <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[320px] max-w-[calc(100vw-1rem)] lg:hidden">
        <Dialog.Title className="sr-only">Sidebar Navigation</Dialog.Title>
        <div className="relative h-full">
          <button
            aria-label="Close sidebar"
            className="absolute right-4 top-4 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" strokeWidth={1.9} />
          </button>

          <SidebarShell
            collapsed={false}
            dashboard={dashboard}
            onNavigate={onClose}
            showDesktopToggle={false}
          />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

function Sidebar({
  dashboard,
  isDesktop,
  isDesktopExpanded,
  isMobileOpen,
  onCloseMobile,
  onToggleDesktop,
}) {
  return (
    <>
      <div className="hidden lg:block">
        <SidebarShell
          collapsed={!isDesktopExpanded}
          dashboard={dashboard}
          onToggleDesktop={onToggleDesktop}
        />
      </div>

      <Dialog.Root onOpenChange={onCloseMobile} open={!isDesktop && isMobileOpen}>
        <MobileSidebar dashboard={dashboard} onClose={onCloseMobile} />
      </Dialog.Root>
    </>
  );
}

export default Sidebar;
