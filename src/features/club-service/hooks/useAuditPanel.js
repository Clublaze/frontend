import { useQuery } from '@tanstack/react-query';
import { getAuditFeedPaginated } from '@club/api/audit.api';

export function useAuditPanel({ page = 1, action } = {}) {
  return useQuery({
    queryKey: ['club-service', 'audit', 'panel', page, action],
    queryFn: () => getAuditFeedPaginated({ action: action || undefined, limit: 20, page }),
  });
}
