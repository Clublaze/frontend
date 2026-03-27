import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 2 minutes — no refetch during this window
      // Keep this LESS than your Redis TTL on the backend
      staleTime: 1000 * 60 * 2,

      // Keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,

      // Don't retry on permission errors or missing resources
      retry: (failureCount, error) => {
        if (error?.type === 'FORBIDDEN') return false
        if (error?.statusCode === 404)   return false
        return failureCount < 2
      },

      // Don't refetch when user switches browser tabs
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})