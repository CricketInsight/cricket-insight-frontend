# Cricket Insights: Data Schema Fields & Descriptions

This document lists the main data fields used in the frontend codebase for players, teams, matches, stats, badges, and moments, along with a brief description of each field. Use this as a reference for designing your database schema.

---

## Player Fields
- `id`: Unique identifier for the player.
- `name`: Full name of the player.
- `country`: Country the player represents.
- `countryFlag`/`flag`: Emoji or image representing the country.
- `avatar`/`photo`/`image`: URL or path to the player's profile picture.
- `role`: Player's main role (e.g., "Right-Hand Batsman", "Right-arm Fast Bowler").
- `searchTerms`: Array of keywords for search/autocomplete.
- `matches`: Total matches played.
- `runs`: Total runs scored (for batters/all-rounders).
- `wickets`: Total wickets taken (for bowlers/all-rounders).
- `average`/`battingAverage`: Batting or bowling average.
- `strikeRate`: Batting or bowling strike rate.
- `centuries`/`hundreds`: Number of centuries scored.
- `fifties`: Number of fifties scored.
- `highestScore`: Highest individual score.
- `debut`: Date of international debut.
- `currentAge`: Player's current age.
- `skills`: Object with skill ratings (average, strikeRate, boundaryPercentage, centuries, pressurePerformance).
- `badges`: Array of special trait badges (see Badges section).
- `careerMomentum`: Array of yearly stats and milestones (see Moments section).
- `shotZones`: Array of preferred shot areas with frequency and runs.
- `teamStats`: Array of performance vs. teams (see TeamStats section).
- `bowlerMatchups`: Array of performance vs. specific bowlers (see BowlerMatchups section).

### Format-Specific Stats (for comparison)
- `stats`: Object keyed by format (T20, ODI, Test), each with:
  - `average`: Batting or bowling average in that format.
  - `strikeRate`: Batting or bowling strike rate in that format.
  - `hundreds`: Centuries in that format.
  - `chaseAvg`: Average when chasing (batting).
  - `boundaryPct`: Percentage of boundaries.
  - `wickets`: Wickets taken (bowling).
  - `economy`: Economy rate (bowling).
  - `dotPct`: Dot ball percentage (bowling).
  - `deathPerf`: Performance in death overs (bowling).

---

## Team Fields
- `id`: Unique identifier for the team.
- `name`: Team name.
- `flag`: Emoji or image for the team/country.
- `logo`: Logo image URL.
- `players`/`squad`: Array of player objects (see Player Fields).
- `topPerformers`: Object with top batter, bowler, all-rounder (see Player Fields).
- `teamStrength`: Object with ratings for battingDepth, strikeRate, bowlingEconomy, deathOvers, fielding.
- `recentMatches`: Array of recent match summaries.
- `rivalries`: Array of head-to-head stats vs. other teams.

---

## Match Fields
- `id`: Unique identifier for the match.
- `team1`/`team2`: Objects with team info (name, flag, logo, score, overs, batting, colors).
- `format`: Match format (T20, ODI, Test).
- `status`: Match status (live, completed, upcoming).
- `result`: Result summary.
- `venue`: Venue name.
- `date`: Date of the match.
- `time`: Start time.
- `series`: Series/tournament name.
- `weather`: Weather info.
- `toss`: Toss result.
- `playerOfMatch`: Player awarded as Player of the Match.
- `highlights`: Array of highlight strings.
- `currentAction`: Current ball-by-ball action (for live).
- `target`: Target runs (for chases).
- `requiredRate`: Required run rate (for chases).
- `currentRate`: Current run rate.
- `scorecard`: Object with detailed batting, bowling, partnerships, fallOfWickets (see below).

### Scorecard Fields
- `batting`: Array of { name, runs, balls, fours, sixes, sr, status }
- `bowling`: Array of { name, overs, maidens, runs, wickets, economy, wd, nb }
- `partnerships`: Array of { wicket, runs, balls, batsmen }
- `fallOfWickets`: Array of { wicket, runs, over, batsman }

---

## Badges (Player Traits)
- `id`: Unique identifier for the badge.
- `name`: Name of the badge (e.g., "Chase Master").
- `icon`: Icon component or name.
- `description`: What the badge means (e.g., "Averages 65+ when chasing targets").
- `color`: Badge color for UI.

---

## Moments (Career Highlights)
- `year`: Year of the event.
- `label`: Description of the milestone (e.g., "World Cup Winner").
- `icon`: Icon name (e.g., "trophy", "award").
- `iconColor`: Color for the icon.

---

## TeamStats (Player vs Team)
- `team`: Opponent team name.
- `matches`: Matches played vs. that team.
- `runs`: Runs scored vs. that team.
- `average`: Batting average vs. that team.
- `status`: Performance status (excellent, good, average, struggle).

---

## BowlerMatchups (Player vs Bowler)
- `bowler`: Bowler name.
- `matches`: Matches faced.
- `runs`: Runs scored off the bowler.
- `average`: Batting average vs. the bowler.
- `status`: Performance status (excellent, good, average, struggle).

---

## Other Common Fields
- `rating`: ICC or custom rating for ranking players/teams.
- `trend`: Recent trend (e.g., "up", "down").

---

This file is auto-generated from the frontend code. Update as your data model evolves. 