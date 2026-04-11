import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { assignRole, getRolesForScope, removeRole } from '@club/api/roles.api';

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'roles'] });
      toast.success('Role assigned successfully.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not assign role.');
    },
  });
}

export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club-service', 'roles'] });
      toast.success('Role removed.');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message ?? 'Could not remove role.');
    },
  });
}

export function useScopeRoles(scopeId) {
  return useQuery({
    queryKey: ['club-service', 'roles', 'scope', scopeId],
    queryFn: () => getRolesForScope(scopeId),
    enabled: !!scopeId,
  });
}
