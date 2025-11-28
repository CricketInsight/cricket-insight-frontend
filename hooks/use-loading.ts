"use client"

import { useState, useEffect } from "react"

interface UseLoadingOptions {
  initialDelay?: number
  minLoadingTime?: number
}

export function useLoading(
  asyncFunction?: () => Promise<any>,
  dependencies: any[] = [],
  options: UseLoadingOptions = {},
) {
  const { initialDelay = 0, minLoadingTime = 1000 } = options
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        startLoading()
        setError(null)

        // Add initial delay if specified
        if (initialDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, initialDelay))
        }

        const startTime = Date.now()
        if (asyncFunction) {
          const result = await asyncFunction()

          // Ensure minimum loading time for better UX
          const elapsedTime = Date.now() - startTime
          const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

          if (remainingTime > 0) {
            await new Promise((resolve) => setTimeout(resolve, remainingTime))
          }

          if (isMounted) {
            setData(result)
            stopLoading()
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err)
          stopLoading()
        }
      }
    }

    if (asyncFunction) {
      loadData()
    }

    return () => {
      isMounted = false
    }
  }, [asyncFunction, ...dependencies])

  return { isLoading, data, error, startLoading, stopLoading }
}
