import { useQuery } from '@tanstack/react-query';
import { getSocietyProfile } from '@club/api/discovery.api';

export function useSocietyProfile(societyId) {
  return useQuery({
    queryKey: ['club-service', 'discover', 'society-profile', societyId],
    queryFn: () => getSocietyProfile(societyId),
    enabled: !!societyId,
  });
}
