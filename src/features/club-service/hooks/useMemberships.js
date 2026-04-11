import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getClubMembers,
  getMyMemberships,
  getPendingMemberships,
} from '@club/api/memberships.api';

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

export function useMemberships({ enabled = true, managedClubIds = [] } = {}) {
  const membershipsQuery = useQuery({
    queryKey: ['club-service', 'memberships', 'my'],
    queryFn: getMyMemberships,
    enabled,
  });

  const pendingQueries = useQueries({
    queries: managedClubIds.map((clubId) => ({
      queryKey: ['club-service', 'memberships', 'pending', clubId],
      queryFn: () => getPendingMemberships(clubId),
      enabled: enabled && !!clubId,
    })),
  });

  const memberQueries = useQueries({
    queries: managedClubIds.map((clubId) => ({
      queryKey: ['club-service', 'memberships', 'club', clubId],
      queryFn: () => getClubMembers(clubId),
      enabled: enabled && !!clubId,
    })),
  });

  return {
    data: {
      clubMembers: memberQueries.flatMap((query, index) =>
        toArray(query.data).map((membership) => ({
          ...membership,
          sourceClubId: managedClubIds[index],
        })),
      ),
      memberships: toArray(membershipsQuery.data),
      pendingMemberships: pendingQueries.flatMap((query, index) =>
        toArray(query.data).map((membership) => ({
          ...membership,
          sourceClubId: managedClubIds[index],
        })),
      ),
    },
    error:
      membershipsQuery.error ||
      pendingQueries.find((query) => query.error)?.error ||
      memberQueries.find((query) => query.error)?.error ||
      null,
    isLoading:
      membershipsQuery.isLoading ||
      pendingQueries.some((query) => query.isLoading) ||
      memberQueries.some((query) => query.isLoading),
  };
}

export default useMemberships;
