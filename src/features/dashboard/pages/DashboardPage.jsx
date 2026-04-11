import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '@ds/components/Loader';
import DashboardCard from '@dashboard/components/DashboardCard';
import DashboardHeader from '@dashboard/components/DashboardHeader';
import { selectUser } from '@store/authSlice';
import { usePermission, useIsAdmin } from '@hooks/usePermission';
import StudentDashboard from '@dashboard/sections/StudentDashboard';
import ApproverDashboard from '@dashboard/sections/ApproverDashboard';
import ClubLeadDashboard from '@dashboard/sections/ClubLeadDashboard';
import AdminDashboard from '@dashboard/sections/AdminDashboard';

const ADMIN_TYPES = ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
const ROLE_PRIORITY = [
  'DEAN', 'HOD', 'FACULTY_ADVISOR', 'PRESIDENT', 'VICE_PRESIDENT',
  'SECRETARY', 'CLUB_LEAD', 'CO_LEAD', 'COORDINATOR',
];

function getDashboardRole(user, roles = []) {
  if (ADMIN_TYPES.includes(user?.userType)) return 'ADMIN';
  const active = roles.filter((role) => role.status !== 'REMOVED').map((role) => role.canonicalRole);
  return ROLE_PRIORITY.find((role) => active.includes(role))
    || (user?.userType === 'FACULTY' ? 'FACULTY' : 'STUDENT');
}

function DashboardPage() {
  const dashboard = useOutletContext() ?? {};
  const user = useSelector(selectUser);
  const isAdmin = useIsAdmin();
  const { can } = usePermission(dashboard.roles ?? []);
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
          Could not load dashboard data. Check that club-service is running.
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
      {isAdmin && <AdminDashboard dashboard={dashboard} />}
      {!isAdmin && can('APPROVE_STEP') && <ApproverDashboard dashboard={dashboard} />}
      {!isAdmin && !can('APPROVE_STEP') && can('MANAGE_MEMBERS') && <ClubLeadDashboard dashboard={dashboard} />}
      {!isAdmin && !can('APPROVE_STEP') && !can('MANAGE_MEMBERS') && <StudentDashboard dashboard={dashboard} />}
    </div>
  );
}

export default DashboardPage;

