import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  blockUser,
  getAdminUsers,
  getApiErrorMessage,
  getUserLoginHistory,
  unblockUser,
} from '@auth/api/auth.api';

export function useAdminUsers({ page, userType, search }) {
  return useQuery({
    queryKey: ['auth', 'admin', 'users', page, userType, search],
    queryFn: () => getAdminUsers({ page, search, userType }),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'admin', 'users'] });
      toast.success('User blocked.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not block user.'));
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'admin', 'users'] });
      toast.success('User unblocked.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Could not unblock user.'));
    },
  });
}

export function useUserLoginHistory(userId) {
  return useQuery({
    queryKey: ['auth', 'admin', 'login-history', userId],
    queryFn: () => getUserLoginHistory(userId),
    enabled: !!userId,
  });
}
