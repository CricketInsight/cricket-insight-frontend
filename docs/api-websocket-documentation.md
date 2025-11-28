# Cricket Insights API & WebSocket Documentation

## Overview

This document provides comprehensive information about the Cricket Insights API and WebSocket integration for the Next.js 14 frontend connecting to a FastAPI backend.

## Table of Contents

1. [Authentication & Security](#authentication--security)
2. [API Endpoints](#api-endpoints)
3. [WebSocket Connections](#websocket-connections)
4. [Data Formats](#data-formats)
5. [Error Handling](#error-handling)
6. [Usage Examples](#usage-examples)
7. [Environment Variables](#environment-variables)

## Authentication & Security

### API Authentication
- **Method**: API Key in headers
- **Header**: `X-API-Key: your_api_key_here`
- **Security Level**: Minimal (no user authentication required)
- **Rate Limiting**: Applied per API key

### WebSocket Authentication
- **Method**: Token-based via query parameter
- **Format**: `wss://ws.cricketinsights.com?token=your_ws_token_here`
- **Connection Limit**: Based on token permissions
- **Auto-reconnect**: Enabled with exponential backoff

## API Endpoints

### Base Configuration
\`\`\`
Base URL: https://api.cricketinsights.com
Content-Type: application/json
Authentication: X-API-Key header
\`\`\`

### 1. Matches API

#### GET /matches
Get all matches with optional filters

**Parameters:**
\`\`\`typescript
{
  format?: string[]           // ['Test', 'ODI', 'T20I', 'T10']
  status?: string[]          // ['upcoming', 'live', 'completed', 'abandoned']
  teams?: string[]           // Team names or IDs
  venues?: string[]          // Venue names
  dateFrom?: string          // ISO date string
  dateTo?: string            // ISO date string
  series?: string[]          // Series names
  limit?: number             // Default: 50, Max: 100
  offset?: number            // For pagination
}
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean
  data: Match[]
  message?: string
}
\`\`\`

#### GET /matches/{matchId}
Get single match details

**Parameters:**
- `matchId` (path): Match ID (integer)

**Response:**
\`\`\`typescript
{
  success: boolean
  data: {
    id: number
    team1: Team
    team2: Team
    format: string
    status: string
    venue: string
    date: string
    startTime?: string
    series: string
    toss?: string
    weather?: string
    result?: string
    playerOfMatch?: string
    target?: number
    requiredRate?: number
    currentRate?: number
    winProbability?: {
      team1: number
      team2: number
    }
  }
}
\`\`\`

#### GET /matches/live
Get all currently live matches

**Response:** Array of Match objects

#### GET /matches/{matchId}/commentary
Get match commentary

**Parameters:**
- `matchId` (path): Match ID
- `limit` (query): Number of entries (default: 50)

**Response:**
\`\`\`typescript
{
  success: boolean
  data: Commentary[]
}
\`\`\`

#### GET /matches/{matchId}/scorecard
Get match scorecard

**Parameters:**
- `matchId` (path): Match ID
- `innings` (query): Specific innings number (optional)

**Response:**
\`\`\`typescript
{
  success: boolean
  data: Scorecard[]
}
\`\`\`

#### GET /matches/{matchId}/win-probability
Get win probability data over time

**Response:**
\`\`\`typescript
{
  success: boolean
  data: {
    over: number
    team1: number
    team2: number
  }[]
}
\`\`\`

### 2. Players API

#### GET /players
Get all players with filters

**Parameters:**
\`\`\`typescript
{
  country?: string[]         // Country codes
  role?: string[]           // ['batsman', 'bowler', 'all-rounder', 'wicket-keeper']
  format?: string           // Specific format for stats
  isActive?: boolean        // Active players only
  minMatches?: number       // Minimum matches played
  sortBy?: string          // 'name', 'runs', 'wickets', 'average', 'strikeRate'
  sortOrder?: string       // 'asc', 'desc'
  limit?: number
  offset?: number
}
\`\`\`

#### GET /players/{playerId}
Get single player details

#### GET /players/{playerId}/stats
Get player statistics

**Parameters:**
- `format` (query): 'test', 'odi', 't20i', 'all'

**Response:**
\`\`\`typescript
{
  success: boolean
  data: {
    playerId: number
    format: string
    batting: {
      matches: number
      innings: number
      runs: number
      average: number
      strikeRate: number
      centuries: number
      fifties: number
      // ... more stats
    }
    bowling?: {
      matches: number
      wickets: number
      average: number
      economy: number
      // ... more stats
    }
    fielding: {
      catches: number
      stumpings: number
      runOuts: number
    }
  }
}
\`\`\`

#### GET /players/{playerId}/career
Get player career progression

#### POST /players/compare
Compare multiple players

**Request Body:**
\`\`\`typescript
{
  playerIds: number[]
}
\`\`\`

#### GET /players/search
Search players by name

**Parameters:**
- `q` (query): Search query string

### 3. Teams API

#### GET /teams
Get all teams with filters

#### GET /teams/{teamId}
Get single team details

#### GET /teams/{teamId}/stats
Get team statistics by format

#### GET /teams/{teamId}/squad
Get current team squad

**Parameters:**
- `format` (query): Format-specific squad

#### GET /teams/rankings
Get team rankings

**Parameters:**
- `format` (query): 'test', 'odi', 't20i'

### 4. Insights API

#### POST /insights/ask
Ask AI for cricket insights

**Request Body:**
\`\`\`typescript
{
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
\`\`\`

**Response:**
\`\`\`typescript
{
  success: boolean
  data: {
    id: string
    query: string
    response: string
    data?: any
    chartType?: 'bar' | 'line' | 'pie' | 'area' | 'scatter'
    timestamp: string
    processingTime: number
  }
}
\`\`\`

#### GET /insights/trends
Get performance trends

**Parameters:**
- `entity`: 'player' | 'team'
- `entityId`: Entity ID
- `metric`: Metric name
- `period`: Time period

#### GET /insights/predictions/match/{matchId}
Get match predictions

## WebSocket Connections

### Connection Setup
\`\`\`typescript
const wsUrl = 'wss://ws.cricketinsights.com?token=your_token'
const ws = new WebSocket(wsUrl)
\`\`\`

### Message Format
All WebSocket messages follow this format:
\`\`\`typescript
{
  type: string        // Message type
  data: any          // Message payload
  timestamp: number  // Unix timestamp
  id?: string       // Optional message ID
}
\`\`\`

### Subscription Types

#### 1. Live Match Updates
**Subscribe:**
\`\`\`typescript
{
  type: 'subscribe_match',
  data: { matchId: number }
}
\`\`\`

**Receive:**
\`\`\`typescript
{
  type: 'match_1234',
  data: {
    match: Match,
    commentary: Commentary[],
    scorecard: Scorecard[],
    lastUpdated: string
  }
}
\`\`\`

#### 2. Commentary Updates
**Receive:**
\`\`\`typescript
{
  type: 'commentary_1234',
  data: {
    id: number,
    matchId: number,
    over: string,
    ball: number,
    runs: number,
    commentary: string,
    type: string,
    timestamp: string
  }
}
\`\`\`

#### 3. Scorecard Updates
**Receive:**
\`\`\`typescript
{
  type: 'scorecard_1234',
  data: {
    matchId: number,
    innings: number,
    batting: BattingStats[],
    bowling: BowlingStats[],
    total: {
      runs: number,
      wickets: number,
      overs: number
    }
  }
}
\`\`\`

#### 4. Win Probability Updates
**Receive:**
\`\`\`typescript
{
  type: 'win_probability_1234',
  data: {
    matchId: number,
    team1: number,
    team2: number,
    over: number,
    timestamp: string
  }
}
\`\`\`

### Connection Management

#### Heartbeat
- **Interval**: 30 seconds
- **Message**: `{ type: 'ping', data: { timestamp: number } }`
- **Response**: `{ type: 'pong', data: { timestamp: number } }`

#### Reconnection
- **Strategy**: Exponential backoff
- **Max Attempts**: 10
- **Initial Delay**: 5 seconds
- **Max Delay**: 30 seconds

## Data Formats

### Common Types

#### Team
\`\`\`typescript
{
  id: number
  name: string
  shortName: string
  logo: string
  flag: string
  score?: number
  wickets?: number
  overs?: number
  batting?: boolean
}
\`\`\`

#### Player
\`\`\`typescript
{
  id: number
  name: string
  fullName: string
  country: string
  countryCode: string
  role: string
  battingStyle: string
  bowlingStyle?: string
  dateOfBirth: string
  debut: {
    test?: string
    odi?: string
    t20i?: string
  }
  photo?: string
  isActive: boolean
}
\`\`\`

#### Match
\`\`\`typescript
{
  id: number
  team1: Team
  team2: Team
  format: 'Test' | 'ODI' | 'T20I' | 'T10'
  status: 'upcoming' | 'live' | 'completed' | 'abandoned'
  venue: string
  date: string
  startTime?: string
  series: string
  result?: string
  winProbability?: {
    team1: number
    team2: number
  }
}
\`\`\`

## Error Handling

### API Errors
\`\`\`typescript
{
  success: false,
  error: string,
  message?: string,
  code?: string
}
\`\`\`

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

### WebSocket Errors
\`\`\`typescript
{
  type: 'error',
  data: {
    code: string,
    message: string,
    details?: any
  }
}
\`\`\`

## Usage Examples

### API Usage
\`\`\`typescript
import { matchesApi } from '@/lib/api/matches'

// Get live matches
const liveMatches = await matchesApi.getLiveMatches()

// Get match with filters
const matches = await matchesApi.getMatches({
  format: ['ODI', 'T20I'],
  status: ['live', 'upcoming'],
  limit: 20
})

// Get match details
const match = await matchesApi.getMatch(1234)
\`\`\`

### WebSocket Usage
\`\`\`typescript
import { useLiveMatch } from '@/hooks/use-live-match'

function MatchPage({ matchId }) {
  const { matchData, isLoading, error } = useLiveMatch({
    matchId,
    autoSubscribe: true
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>{matchData.match.team1.name} vs {matchData.match.team2.name}</h1>
      {/* Match details */}
    </div>
  )
}
\`\`\`

## Environment Variables

### Required Variables
\`\`\`env
NEXT_PUBLIC_API_BASE_URL=https://api.cricketinsights.com
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_WS_URL=wss://ws.cricketinsights.com
NEXT_PUBLIC_WS_TOKEN=your_ws_token_here
\`\`\`

### Optional Variables
\`\`\`env
NEXT_PUBLIC_CDN_URL=https://cdn.cricketinsights.com
NEXT_PUBLIC_IMAGES_URL=https://images.cricketinsights.com
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=info
\`\`\`

## API vs WebSocket Usage Guide

### Use API for:
- Initial data loading
- Search functionality
- Historical data
- User-triggered actions
- Static content
- Pagination

### Use WebSocket for:
- Live match updates
- Real-time commentary
- Live scores
- Win probability changes
- Ball-by-ball updates
- Match status changes

## Rate Limits

### API Limits
- **Free Tier**: 1000 requests/hour
- **Premium**: 10000 requests/hour
- **Enterprise**: Unlimited

### WebSocket Limits
- **Concurrent Connections**: 10 per token
- **Messages per minute**: 1000
- **Subscription limit**: 50 matches per connection

## Support

For technical support or API issues:
- Email: api-support@cricketinsights.com
- Documentation: https://docs.cricketinsights.com
- Status Page: https://status.cricketinsights.com
