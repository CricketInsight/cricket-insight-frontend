import { useState, useEffect, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  loading: boolean,
  options: UseInfiniteScrollOptions = {}
) {
  const [element, setElement] = useState<HTMLElement | null>(null)
  const { threshold = 1.0, rootMargin = '0px' } = options

  const observer = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (element) observer.disconnect?.()
      
      const observerInstance = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback()
          }
        },
        { threshold, rootMargin }
      )
      
      if (node) observerInstance.observe(node)
      setElement(node)
    },
    [callback, hasMore, loading, threshold, rootMargin]
  )

  return observer
}