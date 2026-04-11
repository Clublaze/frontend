import { useQueries } from '@tanstack/react-query';
import { getClubs, getSocieties } from '@club/api/discovery.api';
import { getOrganizationTree } from '@club/api/organizations.api';

function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

function toPagedItems(result) {
  return Array.isArray(result?.data) ? result.data : toArray(result);
}

function flattenTree(nodes, result = []) {
  if (!Array.isArray(nodes)) return result;

  for (const node of nodes) {
    const { children, ...rest } = node;
    result.push(rest);

    if (Array.isArray(children) && children.length) {
      flattenTree(children, result);
    }
  }

  return result;
}

export function useClubs({ enabled = true, limit = 6 } = {}) {
  const [clubsQuery, societiesQuery, organizationsQuery] = useQueries({
    queries: [
      {
        queryKey: ['club-service', 'discover', 'clubs', limit],
        queryFn: () => getClubs(limit),
        enabled,
      },
      {
        queryKey: ['club-service', 'discover', 'societies'],
        queryFn: getSocieties,
        enabled,
      },
      {
        queryKey: ['club-service', 'organizations', 'tree'],
        queryFn: getOrganizationTree,
        enabled,
      },
    ],
  });

  return {
    data: {
      clubs: toPagedItems(clubsQuery.data),
      organizations: flattenTree(toArray(organizationsQuery.data)),
      societies: toArray(societiesQuery.data),
    },
    error: clubsQuery.error || societiesQuery.error || organizationsQuery.error || null,
    isLoading: clubsQuery.isLoading || societiesQuery.isLoading || organizationsQuery.isLoading,
  };
}

export default useClubs;
