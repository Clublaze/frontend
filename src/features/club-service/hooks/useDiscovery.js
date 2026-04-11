import { useQuery } from '@tanstack/react-query';
import {
  getClubs,
  getSocieties,
  getUpcomingEvents,
  searchDiscovery,
} from '@club/api/discovery.api';
import { getOrganizationTree } from '@club/api/organizations.api';

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

export function useDiscoveryClubs(limit = 20) {
  return useQuery({
    queryKey: ['club-service', 'discover', 'clubs', limit],
    queryFn: () => getClubs(limit),
  });
}

export function useDiscoverySocieties() {
  return useQuery({
    queryKey: ['club-service', 'discover', 'societies'],
    queryFn: getSocieties,
  });
}

export function useDiscoveryEvents(limit = 20) {
  return useQuery({
    queryKey: ['club-service', 'discover', 'events', limit],
    queryFn: () => getUpcomingEvents(limit),
  });
}

export function useOrganizationTree() {
  return useQuery({
    queryKey: ['club-service', 'organizations', 'tree'],
    queryFn: getOrganizationTree,
    select: (raw) => {
      const nested = Array.isArray(raw) ? raw : [];
      const units = flattenTree(nested);
      const byId = new Map(units.map((unit) => [String(unit._id), unit]));
      return { units, byId };
    },
  });
}

export function useSearch(query) {
  return useQuery({
    queryKey: ['club-service', 'discover', 'search', query],
    queryFn: () => searchDiscovery(query),
    enabled: typeof query === 'string' && query.trim().length >= 2,
  });
}
