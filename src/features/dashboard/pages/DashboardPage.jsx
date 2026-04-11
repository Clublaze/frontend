import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '@ds/components/Loader';
import DashboardCard from '@dashboard/components/DashboardCard';
import DashboardHeader from '@dashboard/components/DashboardHeader';
import RoleDashboardContent from '@dashboard/components/RoleDashboardContent';
import { selectUser } from '@store/authSlice';

const ADMIN_TYPES = ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
const ROLE_PRIORITY = [
  'DEAN',
  'HOD',
  'FACULTY_ADVISOR',
  'PRESIDENT',
  'VICE_PRESIDENT',
  'SECRETARY',
  'CLUB_LEAD',
  'CO_LEAD',
  'COORDINATOR',
];

function getDashboardRole(user, roles = []) {
  if (ADMIN_TYPES.includes(user?.userType)) {
    return 'ADMIN';
  }

  const activeRoles = roles
    .filter((role) => role.status !== 'REMOVED')
    .map((role) => role.canonicalRole);
  const matchedRole = ROLE_PRIORITY.find((role) => activeRoles.includes(role));

  if (matchedRole) {
    return matchedRole;
  }

  if (user?.userType === 'FACULTY') {
    return 'FACULTY';
  }

  return 'STUDENT';
}

function DashboardPage() {
  const dashboard = useOutletContext() ?? {};
  const user = useSelector(selectUser);
  const dashboardRole = getDashboardRole(user, dashboard.roles);

  if (dashboard.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" text="Building your dashboard..." />
      </div>
    );
  }

  if (dashboard.error) {
    return (
      <DashboardCard className="max-w-2xl" icon="help" title="Dashboard unavailable">
        <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
          Could not load dashboard data. Verify that club-service is running
          and the API base URL is correct in your .env file.
        </p>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        role={dashboardRole}
        roles={dashboard.roles ?? []}
        user={user}
      />
      <RoleDashboardContent dashboard={dashboard} role={dashboardRole} />
    </div>
  );
}

export default DashboardPage;

