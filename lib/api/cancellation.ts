export class CancellationManager {
  private controllers = new Map<string, AbortController>()

  create(key: string): AbortSignal {
    this.cancel(key) // Cancel existing request with same key
    const controller = new AbortController()
    this.controllers.set(key, controller)
    return controller.signal
  }

  cancel(key: string): void {
    const controller = this.controllers.get(key)
    if (controller) {
      controller.abort()
      this.controllers.delete(key)
    }
  }

  cancelAll(): void {
    this.controllers.forEach(controller => controller.abort())
    this.controllers.clear()
  }

  cleanup(key: string): void {
    this.controllers.delete(key)
  }
}

export const cancellationManager = new CancellationManager()

// Hook for React components
export function useCancellation() {
  const createSignal = (key: string) => cancellationManager.create(key)
  const cancel = (key: string) => cancellationManager.cancel(key)
  const cancelAll = () => cancellationManager.cancelAll()
  
  return { createSignal, cancel, cancelAll }
}