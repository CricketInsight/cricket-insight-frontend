"use client"

import { useState, useEffect } from "react"

interface UseLoadingOptions {
  initialDelay?: number
  minLoadingTime?: number
}

export function useLoading(
  asyncFunction: () => Promise<any>,
  dependencies: any[] = [],
  options: UseLoadingOptions = {},
) {
  const { initialDelay = 0, minLoadingTime = 1000 } = options
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Add initial delay if specified
        if (initialDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, initialDelay))
        }

        const startTime = Date.now()
        const result = await asyncFunction()

        // Ensure minimum loading time for better UX
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime))
        }

        if (isMounted) {
          setData(result)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err)
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { isLoading, data, error }
}
