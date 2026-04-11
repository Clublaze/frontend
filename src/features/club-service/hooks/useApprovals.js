import { useQuery } from '@tanstack/react-query';
import { getApprovalDashboard } from '@club/api/approvals.api';
import { formatCanonicalRole } from '@dashboard/utils/dashboardAccess';

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

export function useApprovals({ enabled = true } = {}) {
  const approvalQuery = useQuery({
    queryKey: ['club-service', 'approvals', 'dashboard'],
    queryFn: getApprovalDashboard,
    enabled,
  });

  return {
    data: toArray(approvalQuery.data).map((approval) => ({
      ...approval,
      canonicalRoleLabel: formatCanonicalRole(approval.canonicalRole),
      eventTitle: approval.eventTitle || `Event ${approval.eventId?.slice?.(-6) ?? ''}`,
    })),
    error: approvalQuery.error ?? null,
    isLoading: approvalQuery.isLoading,
  };
}

export default useApprovals;
