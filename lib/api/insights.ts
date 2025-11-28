import { apiClient } from "@/lib/api-client"

export interface InsightQuery {
  query: string
  filters?: {
    players?: string[]
    teams?: string[]
    formats?: string[]
    dateFrom?: string
    dateTo?: string
    venues?: string[]
  }
}

export interface InsightResponse {
  id: string
  query: string
  response: string
  data?: any
  chartType?: "bar" | "line" | "pie" | "area" | "scatter"
  timestamp: string
  processingTime: number
}

export interface TrendAnalysis {
  metric: string
  period: string
  data: {
    date: string
    value: number
    change?: number
    changePercent?: number
  }[]
  insights: string[]
}

export interface PerformanceMetrics {
  category: string
  metrics: {
    name: string
    value: number
    trend: "up" | "down" | "stable"
    trendValue: number
    description: string
  }[]
}

export interface PredictionModel {
  matchId?: number
  team1Id: number
  team2Id: number
  format: string
  venue?: string
  prediction: {
    winProbability: {
      team1: number
      team2: number
      draw?: number
    }
    confidence: number
    factors: {
      factor: string
      impact: number
      description: string
    }[]
  }
  lastUpdated: string
}

export const insightsApi = {
  // Ask AI for cricket insights
  askInsight: async (query: InsightQuery, signal?: AbortSignal): Promise<InsightResponse> => {
    return apiClient.post<InsightResponse>("/insights/ask", query, signal)
  },

  // Get trending insights
  getTrendingInsights: async (limit?: number, signal?: AbortSignal): Promise<InsightResponse[]> => {
    return apiClient.get<InsightResponse[]>("/insights/trending", { limit }, undefined, signal)
  },

  // Get performance trends
  getPerformanceTrends: async (
    entity: "player" | "team",
    entityId: number,
    metric: string,
    period: string,
    signal?: AbortSignal
  ): Promise<TrendAnalysis> => {
    return apiClient.get<TrendAnalysis>("/insights/trends", {
      entity,
      entityId,
      metric,
      period,
    }, undefined, signal)
  },

  // Get performance metrics
  getPerformanceMetrics: async (
    entity: "player" | "team",
    entityId: number,
    format?: string,
    signal?: AbortSignal
  ): Promise<PerformanceMetrics[]> => {
    return apiClient.get<PerformanceMetrics[]>("/insights/metrics", {
      entity,
      entityId,
      format,
    }, undefined, signal)
  },

  // Get match predictions
  getMatchPrediction: async (matchId: number, signal?: AbortSignal): Promise<PredictionModel> => {
    return apiClient.get<PredictionModel>(`/insights/predictions/match/${matchId}`, undefined, undefined, signal)
  },

  // Get custom predictions
  getCustomPrediction: async (
    team1Id: number,
    team2Id: number,
    format: string,
    venue?: string,
    signal?: AbortSignal
  ): Promise<PredictionModel> => {
    return apiClient.post<PredictionModel>("/insights/predictions/custom", {
      team1Id,
      team2Id,
      format,
      venue,
    }, signal)
  },

  // Get statistical comparisons
  getComparison: async (type: "players" | "teams", ids: number[], metrics: string[], format?: string, signal?: AbortSignal): Promise<any> => {
    return apiClient.post("/insights/compare", {
      type,
      ids,
      metrics,
      format,
    }, signal)
  },

  // Get data for charts
  getChartData: async (chartType: string, entity: string, entityId: number, options?: any, signal?: AbortSignal): Promise<any> => {
    return apiClient.get("/insights/charts", {
      type: chartType,
      entity,
      entityId,
      ...options,
    }, undefined, signal)
  },

  // Get insight history
  getInsightHistory: async (limit?: number, signal?: AbortSignal): Promise<InsightResponse[]> => {
    return apiClient.get<InsightResponse[]>("/insights/history", { limit }, undefined, signal)
  },
}
