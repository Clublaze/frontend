import { useQueries } from '@tanstack/react-query';
import { getAuditFeed, getUserAuditHistory } from '@club/api/audit.api';

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function toPagedItems(result) {
  return Array.isArray(result?.data) ? result.data : toArray(result);
}

export function useAuditLogs({
  enabled = true,
  includeFeed = false,
  limit = 6,
  userId,
} = {}) {
  const [userAuditQuery, feedQuery] = useQueries({
    queries: [
      {
        queryKey: ['club-service', 'audit', 'user', userId, limit],
        queryFn: () => getUserAuditHistory(userId, limit),
        enabled: enabled && !!userId,
      },
      {
        queryKey: ['club-service', 'audit', 'feed', limit],
        queryFn: () => getAuditFeed(limit),
        enabled: enabled && includeFeed,
      },
    ],
  });

  return {
    data: {
      auditFeed: toPagedItems(feedQuery.data),
      userAudit: toPagedItems(userAuditQuery.data),
    },
    error: userAuditQuery.error || feedQuery.error || null,
    isLoading: userAuditQuery.isLoading || feedQuery.isLoading,
  };
}

export default useAuditLogs;
