import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getGovernanceTemplates } from '@club/api/governance.api';
import { getRolesForUser } from '@club/api/roles.api';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';
import { selectUser } from '@store/authSlice';
import { useApprovals } from './useApprovals';
import { useAuditLogs } from './useAuditLogs';
import { useClubs } from './useClubs';
import { useEvents } from './useEvents';
import { useMemberships } from './useMemberships';

const ADMIN_TYPES = ['UNIVERSITY_ADMIN', 'ADMIN', 'SUPER_ADMIN'];
const MEMBER_MANAGER_ROLES = ['CLUB_LEAD', 'CO_LEAD', 'COORDINATOR'];
const APPROVER_ROLES = [
  'SECRETARY',
  'VICE_PRESIDENT',
  'PRESIDENT',
  'FACULTY_ADVISOR',
  'HOD',
  'DEAN',
];

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.users)) return result.users;
  return [];
}

function sortByNewest(items, key) {
  return [...items].sort((left, right) => new Date(right[key]) - new Date(left[key]));
}

export function useDashboardStats() {
  const user = useSelector(selectUser);
  const isEnabled = !!user?.id;
  const isAdmin = ADMIN_TYPES.includes(user?.userType);

  const rolesQuery = useQuery({
    queryKey: ['club-service', 'roles', 'user', user?.id],
    queryFn: () => getRolesForUser(user.id),
    enabled: isEnabled,
  });

  const roles = useMemo(
    () => sortByNewest(toArray(rolesQuery.data), 'assignedAt'),
    [rolesQuery.data],
  );
  const activeRoles = useMemo(
    () => roles.filter((role) => role.status !== 'REMOVED'),
    [roles],
  );
  const activeCanonicalRoles = useMemo(
    () => activeRoles.map((role) => role.canonicalRole),
    [activeRoles],
  );
  const canManageMembers = activeCanonicalRoles.some((role) =>
    MEMBER_MANAGER_ROLES.includes(role),
  );
  const canViewApprovals =
    isAdmin || activeCanonicalRoles.some((role) => APPROVER_ROLES.includes(role));
  const manageableClubIds = useMemo(
    () =>
      activeRoles
        .filter((role) => MEMBER_MANAGER_ROLES.includes(role.canonicalRole))
        .map((role) => role.scopeId)
        .filter(Boolean),
    [activeRoles],
  );

  const clubs = useClubs({ enabled: isEnabled });
  const events = useEvents({ enabled: isEnabled, userId: user?.id });
  const memberships = useMemberships({
    enabled: isEnabled,
    managedClubIds: canManageMembers || isAdmin ? manageableClubIds : [],
  });
  const approvals = useApprovals({ enabled: isEnabled && canViewApprovals });
  const auditLogs = useAuditLogs({
    enabled: isEnabled,
    includeFeed: canViewApprovals,
    userId: user?.id,
  });

  const governanceQuery = useQuery({
    queryKey: ['club-service', 'governance', 'templates'],
    queryFn: getGovernanceTemplates,
    enabled: isEnabled && (canViewApprovals || isAdmin),
  });

  const isLoading =
    rolesQuery.isLoading ||
    clubs.isLoading ||
    events.isLoading ||
    memberships.isLoading ||
    approvals.isLoading ||
    auditLogs.isLoading ||
    governanceQuery.isLoading;

  return useMemo(() => {
    const organizations = clubs.data.organizations;
    const orgById = new Map(
      organizations.map((organization) => [String(organization._id), organization]),
    );
    const rawMemberships = sortByNewest(memberships.data.memberships, 'appliedAt');
    const upcomingEvents = events.data.upcomingEvents;
    const createdEvents = events.data.createdEvents;
    const approvalSteps = approvals.data;
    const userAudit = auditLogs.data.userAudit;
    const auditFeed = auditLogs.data.auditFeed;
    const governanceTemplates = toArray(governanceQuery.data);

    const membershipsWithOrg = rawMemberships.map((membership) => ({
      ...membership,
      club: orgById.get(String(membership.clubId)) ?? membership.club ?? null,
    }));

    const pendingMemberships = memberships.data.pendingMemberships.map((membership) => ({
      ...membership,
      club:
        orgById.get(String(membership.sourceClubId)) ??
        orgById.get(String(membership.clubId)) ??
        membership.club ??
        null,
    }));

    const enrichedUpcomingEvents = upcomingEvents.map((event) => ({
      ...event,
      clubName: event.clubName ?? orgById.get(String(event.organizingClubId))?.name ?? null,
    }));

    const enrichedCreatedEvents = createdEvents.map((event) => ({
      ...event,
      clubName: event.clubName ?? orgById.get(String(event.organizingClubId))?.name ?? null,
    }));

    const managedClubs = activeRoles
      .filter((role) => manageableClubIds.includes(role.scopeId))
      .map((role) => ({
        ...role,
        roleLabel: formatCanonicalRole(role.canonicalRole),
        scope: orgById.get(String(role.scopeId)) ?? null,
      }));

    const approvalItems = approvalSteps;

    const stats = {
      membershipsActive: rawMemberships.filter((membership) => membership.status === 'ACTIVE').length,
      membershipsPending: rawMemberships.filter((membership) => membership.status === 'PENDING').length,
      managedClubs: manageableClubIds.length,
      myRoles: roles.length,
      upcomingEvents: enrichedUpcomingEvents.length,
      approvalsPending: approvalItems.length,
      createdEvents: enrichedCreatedEvents.length,
      societies: clubs.data.societies.length,
      clubs: clubs.data.clubs.length,
      auditItems: userAudit.length,
      organizationUnits: organizations.length,
      activeClubs: organizations.filter(
        (organization) => organization.type === 'CLUB' && organization.isActive,
      ).length,
      publicSocieties: organizations.filter(
        (organization) => organization.type === 'SOCIETY' && organization.isPublic,
      ).length,
      auditFeedItems: auditFeed.length,
      pendingMembershipReviews: pendingMemberships.length,
      governanceTemplates: governanceTemplates.length,
    };

    const hasDashboardData =
      roles.length > 0 ||
      organizations.length > 0 ||
      rawMemberships.length > 0 ||
      enrichedUpcomingEvents.length > 0 ||
      clubs.data.clubs.length > 0 ||
      clubs.data.societies.length > 0 ||
      enrichedCreatedEvents.length > 0 ||
      approvalItems.length > 0 ||
      userAudit.length > 0 ||
      auditFeed.length > 0 ||
      governanceTemplates.length > 0;

    const error =
      !isLoading && !hasDashboardData
        ? rolesQuery.error ||
          clubs.error ||
          events.error ||
          memberships.error ||
          approvals.error ||
          auditLogs.error ||
          governanceQuery.error ||
          null
        : null;

    return {
      user,
      isLoading,
      error,
      stats,
      roles,
      organizations,
      memberships: membershipsWithOrg,
      upcomingEvents: enrichedUpcomingEvents,
      discoveredClubs: clubs.data.clubs,
      societies: clubs.data.societies,
      createdEvents: enrichedCreatedEvents,
      approvalItems,
      userAudit,
      auditFeed,
      governanceTemplates,
      managedClubs,
      pendingMemberships,
    };
  }, [
    activeRoles,
    approvals.data,
    approvals.error,
    auditLogs.data.auditFeed,
    auditLogs.data.userAudit,
    auditLogs.error,
    clubs.data.clubs,
    clubs.data.organizations,
    clubs.data.societies,
    clubs.error,
    events.data.createdEvents,
    events.data.upcomingEvents,
    events.error,
    governanceQuery.data,
    governanceQuery.error,
    isLoading,
    manageableClubIds,
    memberships.data.memberships,
    memberships.data.pendingMemberships,
    memberships.error,
    roles,
    rolesQuery.error,
    user,
  ]);
}

export default useDashboardStats;
