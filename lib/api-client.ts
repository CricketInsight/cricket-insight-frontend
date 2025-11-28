const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "demo_api_key_12345"

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

interface ApiError {
  message: string
  status: number
  code?: string
}

class ApiClient {
  private baseURL: string
  private apiKey: string
  private defaultHeaders: Record<string, string>
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  private cookiePrefix = 'cricket_api_'

  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
      Accept: "application/json",
    }
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : ''
    return `${endpoint}${paramString}`
  }

  private setCookie(key: string, data: any, ttlMinutes: number = 30): void {
    try {
      const expires = new Date(Date.now() + ttlMinutes * 60 * 1000)
      const cookieData = JSON.stringify({ data, expires: expires.getTime() })
      document.cookie = `${this.cookiePrefix}${btoa(key)}=${btoa(cookieData)}; expires=${expires.toUTCString()}; path=/`
    } catch (error) {
      console.warn('Failed to set cookie:', error)
    }
  }

  private getCookie(key: string): any | null {
    try {
      const cookieName = `${this.cookiePrefix}${btoa(key)}`
      const cookies = document.cookie.split(';')
      const cookie = cookies.find(c => c.trim().startsWith(cookieName + '='))
      
      if (!cookie) return null
      
      const cookieValue = cookie.split('=')[1]
      const decoded = JSON.parse(atob(cookieValue))
      
      if (Date.now() > decoded.expires) {
        this.deleteCookie(key)
        return null
      }
      
      return decoded.data
    } catch (error) {
      return null
    }
  }

  private deleteCookie(key: string): void {
    try {
      const cookieName = `${this.cookiePrefix}${btoa(key)}`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    } catch (error) {
      console.warn('Failed to delete cookie:', error)
    }
  }

  private getFromCache<T>(key: string): T | null {
    // First check memory cache
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    this.cache.delete(key)
    
    // Then check cookie cache
    return this.getCookie(key)
  }

  private setCache(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
    // Also store in cookies for 30 minutes
    this.setCookie(key, data, 30)
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}, signal?: AbortSignal): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      ...options,
      signal,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    }

    let lastError: ApiError | null = null

    // Retry logic - 3 attempts
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url, config)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          lastError = {
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
            code: errorData.code,
          }

          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw lastError
          }

          // Wait before retry (exponential backoff)
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
            continue
          }

          throw lastError
        }

        const data: ApiResponse<T> = await response.json()

        if (!data.success) {
          throw new Error(data.error || data.message || "API request failed")
        }

        return data.data
      } catch (error) {
        if (attempt === 3) {
          if (error instanceof Error) {
            throw error
          }
          throw lastError || new Error("Unknown API error")
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }

    throw lastError || new Error("Max retries exceeded")
  }

  // GET request with caching
  async get<T>(endpoint: string, params?: Record<string, any>, cacheTtl?: number, signal?: AbortSignal): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params)
    const cached = this.getFromCache<T>(cacheKey)
    
    if (cached) {
      return cached
    }

    const url = new URL(`${this.baseURL}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const result = await this.makeRequest<T>(url.pathname + url.search, {
      method: "GET",
    }, signal)
    
    this.setCache(cacheKey, result, cacheTtl)
    return result
  }

  // POST request
  async post<T>(endpoint: string, data?: any, signal?: AbortSignal): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }, signal)
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, signal?: AbortSignal): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }, signal)
  }

  // DELETE request
  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: "DELETE",
    }, signal)
  }
}

export const apiClient = new ApiClient()
export type { ApiResponse, ApiError }
