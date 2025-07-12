// MongoDB Schema for Cricket Website
// This file contains all the collections and their structures

// =============================================================================
// PLAYERS COLLECTION
// =============================================================================
const PlayersSchema = {
    collection: "players",
    schema: {
      _id: "ObjectId", // MongoDB auto-generated ID
      id: "String", // Custom unique identifier
      name: "String", // Full name of the player
      country: "String", // Country the player represents
      countryFlag: "String", // Emoji or image URL for country flag
      avatar: "String", // URL or path to player's profile picture
      role: "String", // Player's main role (e.g., "Right-Hand Batsman", "Right-arm Fast Bowler")
      searchTerms: ["String"], // Array of keywords for search/autocomplete
      matches: "Number", // Total matches played
      runs: "Number", // Total runs scored (for batters/all-rounders)
      wickets: "Number", // Total wickets taken (for bowlers/all-rounders)
      average: "Number", // Batting or bowling average
      strikeRate: "Number", // Batting or bowling strike rate
      centuries: "Number", // Number of centuries scored
      fifties: "Number", // Number of fifties scored
      highestScore: "Number", // Highest individual score
      debut: "Date", // Date of international debut
      currentAge: "Number", // Player's current age
      rating: "Number", // ICC or custom rating
      trend: "String", // Recent trend (e.g., "up", "down")
      
      // Skills object with detailed ratings
      skills: {
        average: "Number",
        strikeRate: "Number",
        boundaryPercentage: "Number",
        centuries: "Number",
        pressurePerformance: "Number"
      },
      
      // Format-specific statistics
      stats: {
        T20: {
          average: "Number",
          strikeRate: "Number",
          hundreds: "Number",
          chaseAvg: "Number",
          boundaryPct: "Number",
          wickets: "Number",
          economy: "Number",
          dotPct: "Number",
          deathPerf: "Number"
        },
        ODI: {
          average: "Number",
          strikeRate: "Number",
          hundreds: "Number",
          chaseAvg: "Number",
          boundaryPct: "Number",
          wickets: "Number",
          economy: "Number",
          dotPct: "Number",
          deathPerf: "Number"
        },
        Test: {
          average: "Number",
          strikeRate: "Number",
          hundreds: "Number",
          chaseAvg: "Number",
          boundaryPct: "Number",
          wickets: "Number",
          economy: "Number",
          dotPct: "Number",
          deathPerf: "Number"
        }
      },
      
      // Array of special trait badges
      badges: [{
        id: "String",
        name: "String",
        icon: "String",
        description: "String",
        color: "String"
      }],
      
      // Career highlights and milestones
      careerMomentum: [{
        year: "Number",
        label: "String",
        icon: "String",
        iconColor: "String"
      }],
      
      // Preferred shot areas with frequency and runs
      shotZones: [{
        zone: "String",
        frequency: "Number",
        runs: "Number"
      }],
      
      // Performance vs teams
      teamStats: [{
        team: "String",
        matches: "Number",
        runs: "Number",
        average: "Number",
        status: "String" // excellent, good, average, struggle
      }],
      
      // Performance vs specific bowlers
      bowlerMatchups: [{
        bowler: "String",
        matches: "Number",
        runs: "Number",
        average: "Number",
        status: "String" // excellent, good, average, struggle
      }],
      
      createdAt: "Date",
      updatedAt: "Date"
    }
  };
  
  // =============================================================================
  // TEAMS COLLECTION
  // =============================================================================
  const TeamsSchema = {
    collection: "teams",
    schema: {
      _id: "ObjectId",
      id: "String", // Unique identifier for the team
      name: "String", // Team name
      flag: "String", // Emoji or image for the team/country
      logo: "String", // Logo image URL
      rating: "Number", // ICC or custom rating
      trend: "String", // Recent trend
      
      // Array of player IDs (references to players collection)
      players: ["String"], // Array of player IDs
      
      // Top performers with full player info
      topPerformers: {
        batter: {
          id: "String",
          name: "String",
          runs: "Number",
          average: "Number"
        },
        bowler: {
          id: "String",
          name: "String",
          wickets: "Number",
          economy: "Number"
        },
        allRounder: {
          id: "String",
          name: "String",
          runs: "Number",
          wickets: "Number"
        }
      },
      
      // Team strength ratings
      teamStrength: {
        battingDepth: "Number",
        strikeRate: "Number",
        bowlingEconomy: "Number",
        deathOvers: "Number",
        fielding: "Number"
      },
      
      // Recent match summaries
      recentMatches: [{
        matchId: "String",
        opponent: "String",
        result: "String",
        date: "Date",
        format: "String"
      }],
      
      // Head-to-head stats vs other teams
      rivalries: [{
        opponent: "String",
        matchesPlayed: "Number",
        wins: "Number",
        losses: "Number",
        draws: "Number",
        winPercentage: "Number"
      }],
      
      createdAt: "Date",
      updatedAt: "Date"
    }
  };
  
  // =============================================================================
  // MATCHES COLLECTION
  // =============================================================================
  const MatchesSchema = {
    collection: "matches",
    schema: {
      _id: "ObjectId",
      id: "String", // Unique identifier for the match
      format: "String", // T20, ODI, Test
      status: "String", // live, completed, upcoming
      result: "String", // Result summary
      venue: "String", // Venue name
      date: "Date", // Date of the match
      time: "String", // Start time
      series: "String", // Series/tournament name
      weather: "String", // Weather info
      toss: "String", // Toss result
      playerOfMatch: "String", // Player ID of Player of the Match
      highlights: ["String"], // Array of highlight strings
      currentAction: "String", // Current ball-by-ball action (for live)
      target: "Number", // Target runs (for chases)
      requiredRate: "Number", // Required run rate (for chases)
      currentRate: "Number", // Current run rate
      
      // Team information
      team1: {
        id: "String",
        name: "String",
        flag: "String",
        logo: "String",
        score: "String",
        overs: "String",
        batting: "Boolean",
        colors: {
          primary: "String",
          secondary: "String"
        }
      },
      
      team2: {
        id: "String",
        name: "String",
        flag: "String",
        logo: "String",
        score: "String",
        overs: "String",
        batting: "Boolean",
        colors: {
          primary: "String",
          secondary: "String"
        }
      },
      
      // Detailed scorecard
      scorecard: {
        batting: [{
          name: "String",
          runs: "Number",
          balls: "Number",
          fours: "Number",
          sixes: "Number",
          sr: "Number", // Strike rate
          status: "String" // not out, bowled, caught, etc.
        }],
        
        bowling: [{
          name: "String",
          overs: "Number",
          maidens: "Number",
          runs: "Number",
          wickets: "Number",
          economy: "Number",
          wd: "Number", // Wides
          nb: "Number"  // No balls
        }],
        
        partnerships: [{
          wicket: "Number",
          runs: "Number",
          balls: "Number",
          batsmen: ["String"]
        }],
        
        fallOfWickets: [{
          wicket: "Number",
          runs: "Number",
          over: "Number",
          batsman: "String"
        }]
      },
      
      createdAt: "Date",
      updatedAt: "Date"
    }
  };
  
  // =============================================================================
  // BADGES COLLECTION (Player Traits)
  // =============================================================================
  const BadgesSchema = {
    collection: "badges",
    schema: {
      _id: "ObjectId",
      id: "String", // Unique identifier for the badge
      name: "String", // Name of the badge (e.g., "Chase Master")
      icon: "String", // Icon component or name
      description: "String", // What the badge means
      color: "String", // Badge color for UI
      criteria: "String", // Criteria to earn this badge
      
      createdAt: "Date",
      updatedAt: "Date"
    }
  };
  
  // =============================================================================
  // VENUES COLLECTION
  // =============================================================================
  const VenuesSchema = {
    collection: "venues",
    schema: {
      _id: "ObjectId",
      id: "String",
      name: "String",
      city: "String",
      country: "String",
      capacity: "Number",
      pitchType: "String", // spinning, fast, balanced
      averageScore: {
        T20: "Number",
        ODI: "Number",
        Test: "Number"
      },
      coordinates: {
        latitude: "Number",
        longitude: "Number"
      },
      
      createdAt: "Date",
      updatedAt: "Date"
    }
  };
  
  // =============================================================================
  // SERIES COLLECTION
  // =============================================================================
  const SeriesSchema = {
    collection: "series",
    schema: {
      _id: "ObjectId",
      id: "String",
      name: "String",
      format: "String", // T20, ODI, Test
      startDate: "Date",
      endDate: "Date",
      teams: ["String"], // Array of team IDs
      matches: ["String"], // Array of match IDs
      status: "String", // ongoing, completed, upcoming
      winner: "String", // Team ID of series winner
      
      createdAt: "Date",
      updatedAt: "Date"
    }
  };
  
  // =============================================================================
  // BALL BY BALL COLLECTION (for live matches)
  // =============================================================================
  const BallByBallSchema = {
    collection: "ballbyball",
    schema: {
      _id: "ObjectId",
      matchId: "String",
      inning: "Number",
      over: "Number",
      ball: "Number",
      batsman: "String",
      bowler: "String",
      runs: "Number",
      extras: "Number",
      wicket: "Boolean",
      wicketType: "String", // bowled, caught, lbw, etc.
      commentary: "String",
      timestamp: "Date"
    }
  };
  
  // =============================================================================
  // MONGODB INDEXES (for better performance)
  // =============================================================================
  const Indexes = {
    players: [
      { "id": 1 },
      { "name": 1 },
      { "country": 1 },
      { "searchTerms": 1 },
      { "rating": -1 }
    ],
    teams: [
      { "id": 1 },
      { "name": 1 },
      { "rating": -1 }
    ],
    matches: [
      { "id": 1 },
      { "date": -1 },
      { "status": 1 },
      { "format": 1 },
      { "team1.id": 1 },
      { "team2.id": 1 }
    ],
    badges: [
      { "id": 1 },
      { "name": 1 }
    ],
    venues: [
      { "id": 1 },
      { "name": 1 },
      { "country": 1 }
    ],
    series: [
      { "id": 1 },
      { "startDate": -1 },
      { "status": 1 }
    ],
    ballbyball: [
      { "matchId": 1 },
      { "inning": 1, "over": 1, "ball": 1 }
    ]
  };
  
  // =============================================================================
  // SAMPLE DATA INSERTION COMMANDS
  // =============================================================================
  const SampleData = {
    // Sample Player
    insertPlayer: `
      db.players.insertOne({
        id: "player001",
        name: "Virat Kohli",
        country: "India",
        countryFlag: "🇮🇳",
        avatar: "/images/virat-kohli.jpg",
        role: "Right-Hand Batsman",
        searchTerms: ["virat", "kohli", "india", "batsman"],
        matches: 462,
        runs: 26969,
        wickets: 4,
        average: 53.2,
        strikeRate: 93.2,
        centuries: 76,
        fifties: 132,
        highestScore: 254,
        debut: new Date("2008-08-18"),
        currentAge: 35,
        rating: 890,
        trend: "up",
        skills: {
          average: 95,
          strikeRate: 88,
          boundaryPercentage: 42,
          centuries: 98,
          pressurePerformance: 92
        },
        stats: {
          T20: {
            average: 52.7,
            strikeRate: 137.2,
            hundreds: 1,
            chaseAvg: 65.3,
            boundaryPct: 48
          },
          ODI: {
            average: 58.1,
            strikeRate: 93.2,
            hundreds: 46,
            chaseAvg: 68.9,
            boundaryPct: 40
          },
          Test: {
            average: 49.2,
            strikeRate: 56.2,
            hundreds: 29,
            chaseAvg: 45.2,
            boundaryPct: 35
          }
        },
        badges: [
          {
            id: "chase-master",
            name: "Chase Master",
            icon: "target",
            description: "Averages 65+ when chasing targets",
            color: "green"
          }
        ],
        careerMomentum: [
          {
            year: 2023,
            label: "ODI World Cup Runner-up",
            icon: "trophy",
            iconColor: "silver"
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    `,
    
    // Sample Team
    insertTeam: `
      db.teams.insertOne({
        id: "team001",
        name: "India",
        flag: "🇮🇳",
        logo: "/images/india-logo.png",
        rating: 890,
        trend: "up",
        players: ["player001", "player002", "player003"],
        topPerformers: {
          batter: {
            id: "player001",
            name: "Virat Kohli",
            runs: 26969,
            average: 53.2
          },
          bowler: {
            id: "player002",
            name: "Jasprit Bumrah",
            wickets: 145,
            economy: 4.2
          },
          allRounder: {
            id: "player003",
            name: "Hardik Pandya",
            runs: 1456,
            wickets: 78
          }
        },
        teamStrength: {
          battingDepth: 95,
          strikeRate: 88,
          bowlingEconomy: 85,
          deathOvers: 92,
          fielding: 90
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    `,
    
    // Sample Match
    insertMatch: `
      db.matches.insertOne({
        id: "match001",
        format: "ODI",
        status: "completed",
        result: "India won by 7 wickets",
        venue: "Wankhede Stadium",
        date: new Date("2024-01-15"),
        time: "14:30",
        series: "India vs Australia ODI Series 2024",
        weather: "Sunny",
        toss: "India won toss and elected to field",
        playerOfMatch: "player001",
        highlights: [
          "Kohli's brilliant century",
          "Bumrah's deadly spell",
          "Thrilling chase"
        ],
        target: 287,
        team1: {
          id: "team001",
          name: "India",
          flag: "🇮🇳",
          logo: "/images/india-logo.png",
          score: "289/3",
          overs: "47.2",
          batting: false,
          colors: {
            primary: "#FF6B35",
            secondary: "#138808"
          }
        },
        team2: {
          id: "team002",
          name: "Australia",
          flag: "🇦🇺",
          logo: "/images/australia-logo.png",
          score: "286/10",
          overs: "49.4",
          batting: true,
          colors: {
            primary: "#FFCD00",
            secondary: "#008751"
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    `
  };
  
  // =============================================================================
  // EXPORT SCHEMAS
  // =============================================================================
  module.exports = {
    PlayersSchema,
    TeamsSchema,
    MatchesSchema,
    BadgesSchema,
    VenuesSchema,
    SeriesSchema,
    BallByBallSchema,
    Indexes,
    SampleData
  };
  
  // =============================================================================
  // MONGODB CONNECTION AND SETUP COMMANDS
  // =============================================================================
  /*
  To set up this database in MongoDB:
  
  1. Connect to MongoDB:
     mongosh "mongodb://localhost:27017/cricket_db"
  
  2. Create indexes:
     db.players.createIndex({ "id": 1 })
     db.players.createIndex({ "name": 1 })
     db.players.createIndex({ "country": 1 })
     db.players.createIndex({ "searchTerms": 1 })
     db.players.createIndex({ "rating": -1 })
  
  3. Insert sample data:
     // Use the sample data commands from SampleData object
  
  4. Verify collections:
     show collections
     db.players.count()
     db.teams.count()
     db.matches.count()
  */