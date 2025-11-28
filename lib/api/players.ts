import { apiClient } from "@/lib/api-client"

export interface Player {
  cricInfoPlayerId: number
  avatar: any
  battingStyle: string[]
  bowlingStyle: string[]
  career_averages: CareerAverage[]
  country: string
  countryFlag: string
  created_at: string
  dateOfBirth: DateOfBirth
  fullName: string
  gender: string
  hasMatches: boolean
  hasRecords: boolean
  hasStats: boolean
  height: number
  images: any[]
  intlCareerSpan: any
  match_ids: number[]
  name: string
  nickNames: string
  notes: any[]
  placeOfBirth: string
  player_id: string
  profile: any[]
  role: string
  searchTerms: string[]
  stories: any[]
  teams: Team[]
  topRecords: any[]
  totalImages: number
  totalStories: number
  totalVideos: number
  trophyStats: any[]
  updated_at: UpdatedAt
  videos: any[]
}


export interface CareerAverage {
  type: string
  matches: number
  innings: number
  runs: number
  balls: number
  average?: number
  strike_rate?: number
  not_outs: number
  fours: number
  sixes: number
  high_score: string
  hundreds: number
  fifties: number
  catches: number
  stumpings: number
}

export interface DateOfBirth {
  year: number
  month: number
  date: number
}

export interface Team {
  team_id: number
  team_name: string
  team_slug: string
  team_image_url: string
  country_name: string
}

export interface UpdatedAt {
  $date: string
}


export interface PlayerFilters {
  country?: string[]
  role?: string[]
  format?: string
  isActive?: boolean
  minMatches?: number
  sortBy?: "name" | "runs" | "wickets" | "average" | "strikeRate"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface PlayersResponse {
  data: Player[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export const playersApi = {
  // Get all players with filters and pagination (cache for 30 minutes)
  getPlayers: async (filters?: PlayerFilters, signal?: AbortSignal): Promise<PlayersResponse> => {
    const params = { page: 1, limit: 20, ...filters }
    return apiClient.get<PlayersResponse>("/api/players", params, 1800000, signal)
  },

  // Get single player by ID (cache for 1 hour)
  getPlayer: async (playerId: number, signal?: AbortSignal): Promise<Player> => {
    return apiClient.get<Player>(`/api/players/${playerId}`, undefined, 3600000, signal)
  },

  // Search players with pagination (cache for 15 minutes)
  searchPlayers: async (query: string, filters?: PlayerFilters, signal?: AbortSignal): Promise<PlayersResponse> => {
    const params = { q: query, page: 1, limit: 20, ...filters }
    return apiClient.get<PlayersResponse>("/api/players/search", params, 900000, signal)
  },

}
