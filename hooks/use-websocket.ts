"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { wsClient, type WebSocketEventHandler } from "@/lib/websocket-client"

interface UseWebSocketOptions {
  autoConnect?: boolean
  reconnectOnMount?: boolean
}

interface UseWebSocketReturn {
  isConnected: boolean
  connectionState: string
  connect: () => Promise<void>
  disconnect: () => void
  send: (type: string, data: any) => void
  subscribe: (eventType: string, handler: WebSocketEventHandler) => () => void
  error: string | null
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { autoConnect = true, reconnectOnMount = true } = options
  const [isConnected, setIsConnected] = useState(false)
  const [connectionState, setConnectionState] = useState("disconnected")
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const updateConnectionState = useCallback(() => {
    if (!mountedRef.current) return

    const state = wsClient.connectionState
    const connected = wsClient.isConnected

    setConnectionState(state)
    setIsConnected(connected)
  }, [])

  const connect = useCallback(async () => {
    try {
      setError(null)
      await wsClient.connect()
      updateConnectionState()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Connection failed"
      setError(errorMessage)
      console.error("WebSocket connection error:", err)
    }
  }, [updateConnectionState])

  const disconnect = useCallback(() => {
    wsClient.disconnect()
    updateConnectionState()
  }, [updateConnectionState])

  const send = useCallback((type: string, data: any) => {
    wsClient.send(type, data)
  }, [])

  const subscribe = useCallback((eventType: string, handler: WebSocketEventHandler) => {
    return wsClient.subscribe(eventType, handler)
  }, [])

  useEffect(() => {
    mountedRef.current = true

    // Set up error handler
    const unsubscribeError = wsClient.onError((event) => {
      setError("WebSocket error occurred")
      updateConnectionState()
    })

    // Set up close handler
    const unsubscribeClose = wsClient.onClose((event) => {
      updateConnectionState()
      if (event.code !== 1000) {
        setError(`Connection closed: ${event.reason || "Unknown reason"}`)
      }
    })

    // Auto-connect if enabled
    if (autoConnect) {
      connect()
    }

    // Update initial state
    updateConnectionState()

    return () => {
      mountedRef.current = false
      unsubscribeError()
      unsubscribeClose()

      if (!reconnectOnMount) {
        disconnect()
      }
    }
  }, [autoConnect, reconnectOnMount, connect, disconnect, updateConnectionState])

  return {
    isConnected,
    connectionState,
    connect,
    disconnect,
    send,
    subscribe,
    error,
  }
}
