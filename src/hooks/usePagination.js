import { useState } from 'react'

// Generic pagination state for any list page
// Usage: const { page, limit, nextPage, prevPage } = usePagination()
export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page,  setPage]  = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  return {
    page,
    limit,
    goToPage: (p)  => setPage(p),
    nextPage: ()   => setPage((p) => p + 1),
    prevPage: ()   => setPage((p) => Math.max(1, p - 1)),
    setLimit: (l)  => { setLimit(l); setPage(1) },
  }
}