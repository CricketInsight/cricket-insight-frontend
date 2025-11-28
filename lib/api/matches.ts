import { apiClient } from "@/lib/api-client"


export interface Match {
  match_id: string
  bestPerformance: BestPerformance
  created_at: string
  current_action: string
  current_rate: any
  date: string
  format: string
  highlights: any[]
  matchPlayerAwards: any[]
  matchReferees: MatchReferee[]
  match_name: string
  match_start_time: string
  match_start_ts: number
  player_of_match: string
  polls: Polls
  required_rate: any
  reserveUmpires: any
  result: string
  scorecard: Scorecard
  scorecardSummary: ScorecardSummary
  series: string
  series_id: string
  series_key: string
  squad_info: SquadInfo[]
  status: string
  target: any
  team1: Team1
  team2: Team2
  time: string
  toss: string
  tvUmpires: any
  umpires: Umpire[]
  updated_at: UpdatedAt
  venue: string
  weather: string
}


export interface BestPerformance {
  batsmen: Batsmen[]
  bowlers: any[]
  fielders: Fielder[]
}

export interface Batsmen {
  _uid: number
  player: Player
  inningNumber: number
  runs: number
  balls: number
  fours: number
  sixes: number
  strikerate: number
  control: number
  shot: string
  shotRuns: number
  shotFours: number
  shotSixes: number
  wagonData: number[]
  teamAbbreviation: string
}

// Shared base interfaces
export interface DateOfBirth {
  year: number
  month: number
  date: number
}

export interface PeerUrls {
  FILM: any
  WIDE: any
  SQUARE: string
}

export interface Image {
  id: number
  objectId: number
  slug: string
  url: string
  width: number
  height: number
  caption: string
  longCaption: string
  credit?: string
  photographer?: any
  peerUrls: any
}

export interface HeadshotImage {
  id: number
  objectId: number
  slug: string
  url: string
  width: number
  height: number
  caption: string
  longCaption: string
  credit?: any
  photographer: any
  peerUrls: PeerUrls
}

export interface Player {
  id: number
  objectId: number
  name: string
  longName: string
  mobileName: string
  indexName: string
  battingName: string
  fieldingName: string
  slug: string
  imageUrl?: string
  headshotImageUrl?: string
  dateOfBirth: DateOfBirth
  dateOfDeath: any
  gender: string
  battingStyles: string[]
  bowlingStyles: string[]
  longBattingStyles: string[]
  longBowlingStyles: string[]
  image?: Image
  countryTeamId: number
  playerRoleTypeIds: number[]
  playingRoles: string[]
  headshotImage?: HeadshotImage
}

export interface Fielder {
  player: Player
  catches: number
  runouts: number
  stumpings: number
}

export interface MatchReferee {
  id: number
  name: string
  imageUrl: string
  countryTeamId: number
  team: string
  teamAbbreviation: string
  dateOfBirth: DateOfBirth
}

export interface Polls {
  stats: any[]
  generatedAt: string
}

export interface Scorecard {
  batting: Batting[]
  bowling: Bowling[]
  partnerships: any[]
  fallOfWickets: FallOfWicket[]
}

export interface Batting {
  name: string
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  isOut: boolean
  dismissal: string
  team: string
  inning: number
}

export interface Bowling {
  name: string
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
  dots: number
  fours: number
  sixes: number
  wides: number
  noBalls: number
  team: string
  inning: number
}

export interface FallOfWicket {
  wicket: number
  runs: number
  over: number
  batsman: string
  team: string
  inning: number
}

export interface ScorecardSummary {
  innings: Inning[]
  superOverInnings: any[]
}

export interface Inning {
  over: number
  ball: number
  inning: number
  match_id: string
  ball_info: string
  batsman_id: number
  batsman_name: string
  bowler_id: number
  bowler_name: string
  commentary: string
  current_batting_team: string
  current_bowling_team: string
  dismissal: string
  match_result: string
  outcome: string
  pitch_info: string
  players_name: any[]
  runs_on_ball: number
  shot_type: any
  timestamp: Timestamp
}



export interface Timestamp {
  $date: string
}


export interface Team {
  id: number
  objectId: number
  scribeId: number
  slug: string
  name: string
  longName: string
  abbreviation: string
  unofficialName: string
  imageUrl: string
  isCountry: boolean
  primaryColor: any
  image: Image
  country: Country
}

export interface Country {
  id: number
  objectId: number
  name: string
  shortName: string
  abbreviation: string
  slug: string
}


export interface SquadInfo {
  team_id: number
  team_name: string
  team_abbreviation: string
  team_logo_url: string
  players: SquadPlayer[]
  bench_player: any[]
  impact_player: any[]
}

export interface SquadPlayer {
  player_id: number
  cricInfoPlayerId: number
  team_name: string
  name: string
  batting_styles: string[]
  bowling_styles: string[]
  playing_roles: string[]
}

export interface Team1 {
  id: string
  team_id: string
  name: string
  flag: string
  logo: string
  score: string
  overs: string
  batting: boolean
  colors: Colors
}

export interface Colors {
  primary: string
  secondary: string
}

export interface Team2 {
  id: string
  team_id: string
  name: string
  flag: string
  logo: string
  score: string
  overs: string
  batting: boolean
  colors: Colors2
}

export interface Colors2 {
  primary: string
  secondary: string
}

export interface Umpire {
  id: number
  name: string
  imageUrl?: string
  countryTeamId: number
  team: string
  teamAbbreviation: string
  dateOfBirth?: DateOfBirth
}

export interface UpdatedAt {
  $date: string
}



export interface MatchFilters {
  format?: string[]
  teams?: string[]
  venues?: string[]
  dateFrom?: string
  dateTo?: string
  status?: string[]
  tournaments?: string[]
  seasons?: string[]
  page?: number
  limit?: number
}

export interface MatchesResponse {
  data: Match[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export const matchesApi = {
  // Get matches with filters and pagination
  async getMatches(filters?: MatchFilters, signal?: AbortSignal): Promise<MatchesResponse> {
    const params = { page: 1, limit: 20, ...filters }
    return apiClient.get<MatchesResponse>("/api/matches", params, undefined, signal)
  },

  // Get a single match by ID
  async getMatch(id: string, signal?: AbortSignal): Promise<Match | null> {
    return apiClient.get<Match>(`/api/matches/${id}`, undefined, undefined, signal)
  },

  // Get live matches with pagination
  async getLiveMatches(page = 1, limit = 20, signal?: AbortSignal): Promise<MatchesResponse> {
    return apiClient.get<MatchesResponse>("/api/matches/live", { page, limit }, undefined, signal)
  },

  // Get upcoming matches with pagination
  async getUpcomingMatches(page = 1, limit = 20, signal?: AbortSignal): Promise<MatchesResponse> {
    return apiClient.get<MatchesResponse>("/api/matches/upcoming", { page, limit }, undefined, signal)
  },

  // Get recent matches with pagination
  async getRecentMatches(page = 1, limit = 20, signal?: AbortSignal): Promise<MatchesResponse> {
    return apiClient.get<MatchesResponse>("/api/matches/recent", { page, limit }, undefined, signal)
  },

  // Get ball-by-ball data for a match
  async getBallByBall(matchId: string, signal?: AbortSignal): Promise<Inning[]> {
    return apiClient.get<Inning[]>(`/api/ball-by-ball/${matchId}`, undefined, undefined, signal)
  },
}
