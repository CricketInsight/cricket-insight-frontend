const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://ws.cricketinsights.com"
const WS_TOKEN = process.env.NEXT_PUBLIC_WS_TOKEN || "demo_ws_token_67890"

interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
  id?: string
}

interface WebSocketConfig {
  url: string
  token: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
}

type WebSocketEventHandler = (data: any) => void
type WebSocketErrorHandler = (error: Event) => void
type WebSocketCloseHandler = (event: CloseEvent) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map()
  private errorHandlers: WebSocketErrorHandler[] = []
  private closeHandlers: WebSocketCloseHandler[] = []
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isConnecting = false
  private shouldReconnect = true

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      url: WS_BASE_URL,
      token: WS_TOKEN,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting || this.ws?.readyState === WebSocket.CONNECTING) {
        // Wait for existing connection attempt
        const checkConnection = () => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve()
          } else if (this.ws?.readyState === WebSocket.CLOSED || !this.isConnecting) {
            reject(new Error("Connection failed"))
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
        return
      }

      this.isConnecting = true

      try {
        const wsUrl = `${this.config.url}?token=${this.config.token}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = (event) => {
          console.log("WebSocket connected")
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.startHeartbeat()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error)
          }
        }

        this.ws.onerror = (event) => {
          console.error("WebSocket error:", event)
          this.isConnecting = false
          this.errorHandlers.forEach((handler) => handler(event))
          reject(new Error("WebSocket connection failed"))
        }

        this.ws.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason)
          this.isConnecting = false
          this.stopHeartbeat()
          this.closeHandlers.forEach((handler) => handler(event))

          if (this.shouldReconnect && event.code !== 1000) {
            this.scheduleReconnect()
          }
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.shouldReconnect = false
    this.stopHeartbeat()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close(1000, "Client disconnect")
      this.ws = null
    }
  }

  send(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9),
      }

      this.ws.send(JSON.stringify(message))
    } else {
      console.warn("WebSocket not connected, message not sent:", type, data)
    }
  }

  subscribe(eventType: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }

    this.eventHandlers.get(eventType)!.push(handler)

    // Return unsubscribe function
    return () => {
      const handlers = this.eventHandlers.get(eventType)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  onError(handler: WebSocketErrorHandler): () => void {
    this.errorHandlers.push(handler)

    return () => {
      const index = this.errorHandlers.indexOf(handler)
      if (index > -1) {
        this.errorHandlers.splice(index, 1)
      }
    }
  }

  onClose(handler: WebSocketCloseHandler): () => void {
    this.closeHandlers.push(handler)

    return () => {
      const index = this.closeHandlers.indexOf(handler)
      if (index > -1) {
        this.closeHandlers.splice(index, 1)
      }
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(message.type)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message.data)
        } catch (error) {
          console.error("Error in WebSocket message handler:", error)
        }
      })
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = Math.min(this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 30000)

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error)
      })
    }, delay)
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send("ping", { timestamp: Date.now() })
    }, this.config.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  get connectionState(): string {
    if (!this.ws) return "disconnected"

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting"
      case WebSocket.OPEN:
        return "connected"
      case WebSocket.CLOSING:
        return "closing"
      case WebSocket.CLOSED:
        return "closed"
      default:
        return "unknown"
    }
  }
}

export const wsClient = new WebSocketClient()
export type { WebSocketMessage, WebSocketConfig, WebSocketEventHandler }
