import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, updateUserStatus } from '@/api';
import type { PaginationParams } from '@/types';

// Query keys
export const userQueryKeys = {
  all: ['users'] as const,
  list: (params: PaginationParams) => ['users', 'list', params] as const,
};

/**
 * Hook to fetch users with pagination and filters
 */
export const useUsers = (params: PaginationParams) => {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => fetchUsers(params),
  });
};

/**
 * Hook to update user status with optimistic updates
 * 
 * Immediately updates the UI before API response, and reverts on error.
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'active' | 'inactive' }) =>
      updateUserStatus(userId, status),
    
    // Optimistic update: Update UI immediately before API call
    onMutate: async ({ userId, status }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: userQueryKeys.all });

      // Snapshot the previous value for rollback
      const previousUsers = queryClient.getQueriesData({ queryKey: userQueryKeys.all });

      // Optimistically update all user query caches
      queryClient.setQueriesData({ queryKey: userQueryKeys.all }, (old: any) => {
        if (!old?.data?.users) return old;

        return {
          ...old,
          data: {
            ...old.data,
            users: old.data.users.map((user: any) =>
              user.userId === userId ? { ...user, status } : user
            ),
          },
        };
      });

      // Return context with previous data for rollback
      return { previousUsers };
    },

    // Revert on error
    onError: (err, variables, context) => {
      // Rollback to previous state if mutation fails
      if (context?.previousUsers) {
        context.previousUsers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Always refetch after error or success to ensure data is in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};

/**
 * Hook to manually invalidate users cache
 */
export const useInvalidateUsersCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  };
};
