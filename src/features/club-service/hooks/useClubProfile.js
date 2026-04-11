import { useQuery } from '@tanstack/react-query';
import { getClubProfile } from '@club/api/discovery.api';

export function useClubProfile(clubId) {
  return useQuery({
    queryKey: ['club-service', 'discover', 'club-profile', clubId],
    queryFn: () => getClubProfile(clubId),
    enabled: !!clubId,
  });
}
