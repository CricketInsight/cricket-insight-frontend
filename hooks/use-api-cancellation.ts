import { useEffect, useRef } from 'react'
import { cancellationManager } from '@/lib/api/cancellation'

export function useApiCancellation() {
  const controllersRef = useRef<Set<string>>(new Set())

  const createSignal = (key: string): AbortSignal => {
    controllersRef.current.add(key)
    return cancellationManager.create(key)
  }

  const cancel = (key: string): void => {
    cancellationManager.cancel(key)
    controllersRef.current.delete(key)
  }

  const cancelAll = (): void => {
    controllersRef.current.forEach(key => cancellationManager.cancel(key))
    controllersRef.current.clear()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAll()
    }
  }, [])

  return { createSignal, cancel, cancelAll }
}