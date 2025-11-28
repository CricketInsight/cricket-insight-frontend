"use client"

import { useEffect, useState, useCallback } from "react"
import { useWebSocket } from "./use-websocket"
import type { Match, Commentary, Scorecard } from "@/lib/api/matches"

interface LiveMatchData {
  match: Match
  commentary: Commentary[]
  scorecard: Scorecard[]
  lastUpdated: string
}

interface UseLiveMatchOptions {
  matchId: string
  autoSubscribe?: boolean
}

interface UseLiveMatchReturn {
  matchData: LiveMatchData | null
  isLoading: boolean
  error: string | null
  subscribe: () => void
  unsubscribe: () => void
  isSubscribed: boolean
}

export function useLiveMatch({ matchId, autoSubscribe = true }: UseLiveMatchOptions): UseLiveMatchReturn {
  const [matchData, setMatchData] = useState<LiveMatchData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const {
    isConnected,
    subscribe: wsSubscribe,
    send,
  } = useWebSocket({
    autoConnect: autoSubscribe,
    reconnectOnMount: autoSubscribe,
  })

  const handleMatchUpdate = useCallback((data: any) => {
    try {
      setMatchData(data)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      setError("Failed to process match update")
      console.error("Match update error:", err)
    }
  }, [])

  const handleCommentaryUpdate = useCallback((data: Commentary) => {
    setMatchData((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        commentary: [data, ...prev.commentary.slice(0, 49)], // Keep last 50 entries
        lastUpdated: new Date().toISOString(),
      }
    })
  }, [])

  const handleScorecardUpdate = useCallback((data: Scorecard) => {
    setMatchData((prev) => {
      if (!prev) return prev

      const updatedScorecard = prev.scorecard.map((sc) => (sc.innings === data.innings ? data : sc))

      // If innings not found, add it
      if (!updatedScorecard.find((sc) => sc.innings === data.innings)) {
        updatedScorecard.push(data)
      }

      return {
        ...prev,
        scorecard: updatedScorecard,
        lastUpdated: new Date().toISOString(),
      }
    })
  }, [])

  const handleError = useCallback((data: any) => {
    setError(data.message || "Live match error")
    setIsLoading(false)
  }, [])

  const subscribe = useCallback(() => {
    if (!isConnected || isSubscribed) return

    // Subscribe to match updates
    const unsubscribeMatch = wsSubscribe(`match_${matchId}`, handleMatchUpdate)
    const unsubscribeCommentary = wsSubscribe(`commentary_${matchId}`, handleCommentaryUpdate)
    const unsubscribeScorecard = wsSubscribe(`scorecard_${matchId}`, handleScorecardUpdate)
    const unsubscribeError = wsSubscribe(`match_error_${matchId}`, handleError)

    // Request initial data
    send("subscribe_match", { matchId })

    setIsSubscribed(true)
    setIsLoading(true)

    // Return cleanup function
    return () => {
      unsubscribeMatch()
      unsubscribeCommentary()
      unsubscribeScorecard()
      unsubscribeError()
      setIsSubscribed(false)
    }
  }, [
    isConnected,
    isSubscribed,
    matchId,
    wsSubscribe,
    send,
    handleMatchUpdate,
    handleCommentaryUpdate,
    handleScorecardUpdate,
    handleError,
  ])

  const unsubscribe = useCallback(() => {
    if (!isSubscribed) return

    send("unsubscribe_match", { matchId })
    setIsSubscribed(false)
  }, [isSubscribed, matchId, send])

  useEffect(() => {
    if (autoSubscribe && isConnected && !isSubscribed) {
      subscribe()
    }

    return () => {
      if (isSubscribed) {
        unsubscribe()
      }
    }
  }, [autoSubscribe, isConnected, isSubscribed, subscribe, unsubscribe])

  return {
    matchData,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    isSubscribed,
  }
}
