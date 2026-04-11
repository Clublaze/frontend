import ApprovalSection from '@dashboard/sections/ApprovalSection';
import AuditSection from '@dashboard/sections/AuditSection';
import EventSection from '@dashboard/sections/EventSection';
import MemberSection from '@dashboard/sections/MemberSection';
import MembershipsSection from '@dashboard/sections/MembershipsSection';
import OrgSection from '@dashboard/sections/OrgSection';
import StatsSection from '@dashboard/sections/StatsSection';
import { usePermission, useIsAdmin } from '@hooks/usePermission';

function RoleDashboardContent({ dashboard, role }) {
  const { can } = usePermission(dashboard.roles ?? []);
  const isAdmin = useIsAdmin();
  const showApprovals = can('APPROVE_STEP');
  const showEvents = can('CREATE_EVENT');
  const showMembers = can('MANAGE_MEMBERS');
  const showAudit = can('VIEW_APPROVALS');
  const showOrg = isAdmin || ['DEAN', 'HOD'].includes(role);

  return (
    <>
      <StatsSection dashboard={dashboard} />

      {showApprovals ? <ApprovalSection items={dashboard.approvalItems} /> : null}
      {showEvents ? <EventSection events={dashboard.createdEvents} /> : null}
      {showMembers ? (
        <MemberSection pending={dashboard.pendingMemberships} />
      ) : null}
      {showAudit ? <AuditSection feed={dashboard.auditFeed} /> : null}
      {showOrg ? (
        <OrgSection
          organizations={dashboard.organizations}
          stats={dashboard.stats}
          templates={dashboard.governanceTemplates}
        />
      ) : null}

      <MembershipsSection
        discoveredClubs={dashboard.discoveredClubs}
        memberships={dashboard.memberships}
        upcomingEvents={dashboard.upcomingEvents}
      />
    </>
  );
}

export default RoleDashboardContent;
