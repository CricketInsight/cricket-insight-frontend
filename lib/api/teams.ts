import { apiClient } from "@/lib/api-client"

export interface Team {
  id: number
  name: string
  shortName: string
  country: string
  countryCode: string
  logo: string
  flag: string
  founded: number
  homeGround: string
  captain: {
    test?: string
    odi?: string
    t20i?: string
  }
  coach: string
  isActive: boolean
}

export interface TeamStats {
  teamId: number
  format: "test" | "odi" | "t20i" | "all"
  matches: number
  wins: number
  losses: number
  draws?: number
  tied?: number
  noResult?: number
  winPercentage: number
  ranking: {
    position: number
    points: number
    rating: number
  }
}

export interface TeamSquad {
  teamId: number
  format: string
  players: {
    playerId: number
    playerName: string
    role: string
    isCaptain: boolean
    isViceCaptain: boolean
    isWicketKeeper: boolean
  }[]
  lastUpdated: string
}

export interface TeamPerformance {
  teamId: number
  format: string
  homeRecord: {
    matches: number
    wins: number
    losses: number
    draws?: number
    winPercentage: number
  }
  awayRecord: {
    matches: number
    wins: number
    losses: number
    draws?: number
    winPercentage: number
  }
  neutralRecord: {
    matches: number
    wins: number
    losses: number
    draws?: number
    winPercentage: number
  }
  vsTeams: {
    opponent: string
    matches: number
    wins: number
    losses: number
    draws?: number
    winPercentage: number
  }[]
}

export interface TeamFilters {
  format?: string
  isActive?: boolean
  region?: string[]
  sortBy?: "name" | "ranking" | "winPercentage"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface TeamsResponse {
  data: Team[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export const teamsApi = {
  // Get all teams with filters and pagination
  getTeams: async (filters?: TeamFilters, signal?: AbortSignal): Promise<TeamsResponse> => {
    const params = { page: 1, limit: 20, ...filters }
    return apiClient.get<TeamsResponse>("/api/teams", params, undefined, signal)
  },

  // Get single team by ID
  getTeam: async (teamId: number, signal?: AbortSignal): Promise<Team> => {
    return apiClient.get<Team>(`/api/teams/${teamId}`, undefined, undefined, signal)
  },

  // Get team statistics
  getTeamStats: async (teamId: number, format?: string, signal?: AbortSignal): Promise<TeamStats> => {
    return apiClient.get<TeamStats>(`/api/teams/${teamId}/stats`, { format }, undefined, signal)
  },

  // Get team squad
  getTeamSquad: async (teamId: number, format?: string, signal?: AbortSignal): Promise<TeamSquad> => {
    return apiClient.get<TeamSquad>(`/api/teams/${teamId}/squad`, { format }, undefined, signal)
  },

  // Get team performance
  getTeamPerformance: async (teamId: number, format?: string, signal?: AbortSignal): Promise<TeamPerformance> => {
    return apiClient.get<TeamPerformance>(`/api/teams/${teamId}/performance`, { format }, undefined, signal)
  },

  // Get team rankings with pagination
  getTeamRankings: async (format: string, page = 1, limit = 20, signal?: AbortSignal): Promise<TeamsResponse> => {
    return apiClient.get<TeamsResponse>("/api/teams/rankings", { format, page, limit }, undefined, signal)
  },

  // Get team recent matches with pagination
  getTeamMatches: async (teamId: number, page = 1, limit = 20, signal?: AbortSignal): Promise<MatchesResponse> => {
    return apiClient.get<MatchesResponse>(`/api/teams/${teamId}/matches`, { page, limit }, undefined, signal)
  },

  // Get team upcoming matches with pagination
  getTeamUpcomingMatches: async (teamId: number, page = 1, limit = 20, signal?: AbortSignal): Promise<MatchesResponse> => {
    return apiClient.get<MatchesResponse>(`/api/teams/${teamId}/matches/upcoming`, { page, limit }, undefined, signal)
  },

  // Search teams with pagination
  searchTeams: async (query: string, filters?: TeamFilters, signal?: AbortSignal): Promise<TeamsResponse> => {
    const params = { q: query, page: 1, limit: 20, ...filters }
    return apiClient.get<TeamsResponse>("/api/teams/search", params, undefined, signal)
  },

  // Get head-to-head record
  getHeadToHead: async (team1Id: number, team2Id: number, format?: string, signal?: AbortSignal): Promise<any> => {
    return apiClient.get(`/api/teams/${team1Id}/vs/${team2Id}`, { format }, undefined, signal)
  },
}
