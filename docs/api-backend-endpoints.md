# Backend API Endpoints Required by Frontend

This document lists all backend API endpoints required by the frontend, based on the API usage in `lib/api/matches.ts`, `lib/api/insights.ts`, `lib/api/players.ts`, and `lib/api/teams.ts`.

---

## Matches API

- **GET** `/matches` — Get all matches (supports filters via query params)
- **GET** `/matches/:id` — Get a single match by ID
- **GET** `/matches/live` — Get all live matches
- **GET** `/matches/upcoming` — Get all upcoming matches
- **GET** `/matches/recent` — Get recent matches

---

## Insights API

- **POST** `/insights/ask` — Ask AI for cricket insights
- **GET** `/insights/trending` — Get trending insights (optional: `limit`)
- **GET** `/insights/trends` — Get performance trends (query: `entity`, `entityId`, `metric`, `period`)
- **GET** `/insights/metrics` — Get performance metrics (query: `entity`, `entityId`, `format`)
- **GET** `/insights/predictions/match/:matchId` — Get match prediction by match ID
- **POST** `/insights/predictions/custom` — Get custom match prediction (body: `team1Id`, `team2Id`, `format`, `venue`)
- **POST** `/insights/compare` — Get statistical comparison (body: `type`, `ids`, `metrics`, `format`)
- **GET** `/insights/charts` — Get data for charts (query: `type`, `entity`, `entityId`, ...options)
- **GET** `/insights/history` — Get insight history (optional: `limit`)

---

## Players API

- **GET** `/players` — Get all players (supports filters via query params)
- **GET** `/players/:playerId` — Get single player by ID
- **GET** `/players/:playerId/stats` — Get player statistics (optional: `format`)
- **GET** `/players/:playerId/career` — Get player career data
- **POST** `/players/compare` — Compare players (body: `playerIds`)
- **GET** `/players/rankings` — Get player rankings (query: `format`, `category`, `limit`)
- **GET** `/players/search` — Search players (query: `q`, ...filters)
- **GET** `/players/:playerId/matches` — Get player recent matches (optional: `limit`)
- **GET** `/players/:playerId/vs-teams` — Get player performance against teams (optional: `format`)
- **GET** `/players/:playerId/matchups/:type` — Get player performance against bowlers/batsmen (query: `format`)

---

## Teams API

- **GET** `/teams` — Get all teams (supports filters via query params)
- **GET** `/teams/:teamId` — Get single team by ID
- **GET** `/teams/:teamId/stats` — Get team statistics (optional: `format`)
- **GET** `/teams/:teamId/squad` — Get team squad (optional: `format`)
- **GET** `/teams/:teamId/performance` — Get team performance (optional: `format`)
- **GET** `/teams/rankings` — Get team rankings (query: `format`)
- **GET** `/teams/:teamId/matches` — Get team recent matches (optional: `limit`)
- **GET** `/teams/:teamId/matches/upcoming` — Get team upcoming matches (optional: `limit`)
- **GET** `/teams/search` — Search teams (query: `q`, ...filters)
- **GET** `/teams/:team1Id/vs/:team2Id` — Get head-to-head record (optional: `format`)
