"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"
import { Radar } from "react-chartjs-2"
import {
  Trophy,
  Users,
  Target,
  Star,
  Award,
  Zap,
  Activity,
  Globe,
  CheckCircle,
  XCircle,
  Minus,
  Crown,
  Shield,
  ArrowLeft,
  Search,
  X,
} from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler,
)

// Available Teams Data
const availableTeams = [
  {
    id: 1,
    name: "India",
    flag: "🇮🇳",
    shortName: "IND",
    searchTerms: ["india", "ind", "team india", "men in blue", "indian cricket"],
  },
  {
    id: 2,
    name: "Australia",
    flag: "🇦🇺",
    shortName: "AUS",
    searchTerms: ["australia", "aus", "aussies", "baggy greens", "australian cricket"],
  },
  {
    id: 3,
    name: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    shortName: "ENG",
    searchTerms: ["england", "eng", "three lions", "english cricket", "ecb"],
  },
  {
    id: 4,
    name: "Pakistan",
    flag: "🇵🇰",
    shortName: "PAK",
    searchTerms: ["pakistan", "pak", "green shirts", "pakistani cricket", "pcb"],
  },
  {
    id: 5,
    name: "South Africa",
    flag: "🇿🇦",
    shortName: "SA",
    searchTerms: ["south africa", "sa", "proteas", "south african cricket", "csa"],
  },
  {
    id: 6,
    name: "New Zealand",
    flag: "🇳🇿",
    shortName: "NZ",
    searchTerms: ["new zealand", "nz", "black caps", "kiwis", "new zealand cricket"],
  },
  {
    id: 7,
    name: "West Indies",
    flag: "🇯🇲",
    shortName: "WI",
    searchTerms: ["west indies", "wi", "windies", "caribbean", "cricket west indies"],
  },
  {
    id: 8,
    name: "Sri Lanka",
    flag: "🇱🇰",
    shortName: "SL",
    searchTerms: ["sri lanka", "sl", "lions", "sri lankan cricket", "slc"],
  },
  {
    id: 9,
    name: "Bangladesh",
    flag: "🇧🇩",
    shortName: "BAN",
    searchTerms: ["bangladesh", "ban", "tigers", "bangladeshi cricket", "bcb"],
  },
  {
    id: 10,
    name: "Afghanistan",
    flag: "🇦🇫",
    shortName: "AFG",
    searchTerms: ["afghanistan", "afg", "afghan cricket", "afghanistan cricket board", "acb"],
  },
]

function TeamSearchBar({ onTeamSelect }: { onTeamSelect: (teamId: number) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<typeof availableTeams>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.length > 0) {
      const filtered = availableTeams.filter((team) =>
        team.searchTerms.some((term) => term.toLowerCase().includes(value.toLowerCase())),
      )
      setSuggestions(filtered.slice(0, 8))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTeamSelect = (team: (typeof availableTeams)[0]) => {
    setSearchTerm(team.name)
    setShowSuggestions(false)
    onTeamSelect(team.id)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const getSearchBarRect = () => {
    if (searchRef.current) {
      return searchRef.current.getBoundingClientRect()
    }
    return null
  }

  const searchBarRect = getSearchBarRect()

  return (
    <>
      <div ref={searchRef} className="relative w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isClient &&
        showSuggestions &&
        suggestions.length > 0 &&
        searchBarRect &&
        createPortal(
          <div
            className="fixed glass-morphism rounded-xl shadow-2xl max-h-80 overflow-y-auto border border-white/30 backdrop-blur-xl"
            style={{
              top: searchBarRect.bottom + window.scrollY + 8,
              left: searchBarRect.left + window.scrollX,
              width: searchBarRect.width,
              zIndex: 999999,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {suggestions.map((team, index) => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-white/20 transition-all duration-300 text-left group hover:scale-[1.02] ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${index === suggestions.length - 1 ? "rounded-b-xl border-b-0" : "border-b border-white/10"}`}
              >
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                  {team.flag}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300 text-lg mb-1">
                    {team.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 font-medium">
                      {team.shortName}
                    </span>
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300">
                      Cricket Team
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 group-hover:from-blue-400 group-hover:to-purple-500 transition-all duration-300">
                    #{Math.floor(Math.random() * 10) + 1}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

// Mock Team Data Generator (same as before)
const generateTeamData = (teamId: number) => {
  const team = availableTeams.find((t) => t.id === teamId) || availableTeams[0]

  return {
    id: teamId,
    name: team.name,
    flag: team.flag,
    logo: "/placeholder.svg?height=80&width=80",
    captain:
      teamId === 1 ? "Rohit Sharma" : teamId === 2 ? "Pat Cummins" : teamId === 3 ? "Jos Buttler" : "Captain Name",
    coach:
      teamId === 1 ? "Rahul Dravid" : teamId === 2 ? "Andrew McDonald" : teamId === 3 ? "Matthew Mott" : "Coach Name",
    rankings: {
      odi: Math.floor(Math.random() * 10) + 1,
      t20: Math.floor(Math.random() * 10) + 1,
      test: Math.floor(Math.random() * 10) + 1,
    },
    winPercentage: (Math.random() * 30 + 60).toFixed(1),
    colors: {
      primary:
        teamId === 1
          ? "from-blue-600 to-indigo-700"
          : teamId === 2
            ? "from-yellow-500 to-green-600"
            : teamId === 3
              ? "from-red-600 to-blue-700"
              : teamId === 4
                ? "from-green-600 to-emerald-700"
                : "from-purple-600 to-pink-700",
      secondary: "from-orange-500 to-red-600",
      accent: "from-green-500 to-emerald-600",
    },
    squad: {
      batters: [
        {
          id: 1,
          name:
            teamId === 1 ? "Virat Kohli" : teamId === 2 ? "Steve Smith" : teamId === 3 ? "Joe Root" : "Top Batter 1",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Avg: " + (Math.random() * 20 + 40).toFixed(1),
          insight: "In form 🔥",
        },
        {
          id: 2,
          name:
            teamId === 1
              ? "Rohit Sharma"
              : teamId === 2
                ? "David Warner"
                : teamId === 3
                  ? "Jonny Bairstow"
                  : "Top Batter 2",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Avg: " + (Math.random() * 20 + 35).toFixed(1),
          insight: "Captain 👑",
        },
        {
          id: 3,
          name:
            teamId === 1
              ? "Shubman Gill"
              : teamId === 2
                ? "Marnus Labuschagne"
                : teamId === 3
                  ? "Harry Brook"
                  : "Rising Star",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Avg: " + (Math.random() * 15 + 35).toFixed(1),
          insight: "Rising star ⭐",
        },
        {
          id: 4,
          name:
            teamId === 1
              ? "KL Rahul"
              : teamId === 2
                ? "Travis Head"
                : teamId === 3
                  ? "Ben Duckett"
                  : "Consistent Batter",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Avg: " + (Math.random() * 15 + 30).toFixed(1),
          insight: "Consistent 📈",
        },
      ],
      bowlers: [
        {
          id: 5,
          name:
            teamId === 1
              ? "Jasprit Bumrah"
              : teamId === 2
                ? "Pat Cummins"
                : teamId === 3
                  ? "James Anderson"
                  : "Lead Bowler",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Wkts: " + Math.floor(Math.random() * 100 + 50),
          insight: "Death specialist 💀",
        },
        {
          id: 6,
          name:
            teamId === 1
              ? "Mohammed Shami"
              : teamId === 2
                ? "Mitchell Starc"
                : teamId === 3
                  ? "Stuart Broad"
                  : "Experienced Bowler",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Wkts: " + Math.floor(Math.random() * 150 + 100),
          insight: "Experienced 🎯",
        },
        {
          id: 7,
          name:
            teamId === 1 ? "Kuldeep Yadav" : teamId === 2 ? "Adam Zampa" : teamId === 3 ? "Adil Rashid" : "Spin Bowler",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Wkts: " + Math.floor(Math.random() * 100 + 80),
          insight: "Spin wizard 🌪️",
        },
        {
          id: 8,
          name:
            teamId === 1
              ? "Mohammed Siraj"
              : teamId === 2
                ? "Josh Hazlewood"
                : teamId === 3
                  ? "Mark Wood"
                  : "Fast Bowler",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Wkts: " + Math.floor(Math.random() * 80 + 40),
          insight: "Pace threat ⚡",
        },
      ],
      allRounders: [
        {
          id: 9,
          name:
            teamId === 1
              ? "Hardik Pandya"
              : teamId === 2
                ? "Glenn Maxwell"
                : teamId === 3
                  ? "Ben Stokes"
                  : "All-Rounder 1",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "SR: " + (Math.random() * 40 + 100).toFixed(1),
          insight: "Power hitter 💥",
        },
        {
          id: 10,
          name:
            teamId === 1
              ? "Ravindra Jadeja"
              : teamId === 2
                ? "Marcus Stoinis"
                : teamId === 3
                  ? "Moeen Ali"
                  : "All-Rounder 2",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Avg: " + (Math.random() * 15 + 25).toFixed(1),
          insight: "Complete package 🎪",
        },
        {
          id: 11,
          name:
            teamId === 1
              ? "Axar Patel"
              : teamId === 2
                ? "Cameron Green"
                : teamId === 3
                  ? "Sam Curran"
                  : "All-Rounder 3",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Eco: " + (Math.random() * 2 + 4).toFixed(2),
          insight: "Economical 💰",
        },
      ],
      wicketkeepers: [
        {
          id: 12,
          name:
            teamId === 1 ? "MS Dhoni" : teamId === 2 ? "Alex Carey" : teamId === 3 ? "Jos Buttler" : "Wicketkeeper 1",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "Avg: " + (Math.random() * 20 + 35).toFixed(1),
          insight: "Legend 👑",
        },
        {
          id: 13,
          name:
            teamId === 1
              ? "Rishabh Pant"
              : teamId === 2
                ? "Josh Inglis"
                : teamId === 3
                  ? "Jonny Bairstow"
                  : "Wicketkeeper 2",
          photo: "/placeholder.svg?height=60&width=60",
          stat: "SR: " + (Math.random() * 40 + 100).toFixed(1),
          insight: "Explosive 🧨",
        },
      ],
    },
    recentMatches: [
      {
        id: 1,
        opponent: "Australia",
        opponentFlag: "🇦🇺",
        result: Math.random() > 0.5 ? "win" : "loss",
        date: "2024-01-15",
        margin: "6 wickets",
      },
      {
        id: 2,
        opponent: "England",
        opponentFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        result: Math.random() > 0.5 ? "win" : "loss",
        date: "2024-01-12",
        margin: "125 runs",
      },
      {
        id: 3,
        opponent: "South Africa",
        opponentFlag: "🇿🇦",
        result: Math.random() > 0.5 ? "win" : "loss",
        date: "2024-01-08",
        margin: "7 runs",
      },
      {
        id: 4,
        opponent: "New Zealand",
        opponentFlag: "🇳🇿",
        result: Math.random() > 0.5 ? "win" : "loss",
        date: "2024-01-05",
        margin: "8 wickets",
      },
      {
        id: 5,
        opponent: "Pakistan",
        opponentFlag: "🇵🇰",
        result: Math.random() > 0.5 ? "win" : "loss",
        date: "2024-01-02",
        margin: "89 runs",
      },
      {
        id: 6,
        opponent: "West Indies",
        opponentFlag: "🇯🇲",
        result: Math.random() > 0.5 ? "win" : "loss",
        date: "2023-12-28",
        margin: "5 wickets",
      },
      {
        id: 7,
        opponent: "Sri Lanka",
        opponentFlag: "🇱🇰",
        result: Math.random() > 0.3 ? (Math.random() > 0.5 ? "win" : "loss") : "no-result",
        date: "2023-12-25",
        margin: "Rain",
      },
    ],
    topPerformers: {
      batter: {
        name: teamId === 1 ? "Virat Kohli" : teamId === 2 ? "Steve Smith" : teamId === 3 ? "Joe Root" : "Top Batter",
        photo: "/placeholder.svg?height=80&width=80",
        runs: Math.floor(Math.random() * 500 + 1000),
        average: (Math.random() * 20 + 45).toFixed(2),
        strikeRate: (Math.random() * 30 + 85).toFixed(2),
        badges: ["In form", "Century King"],
      },
      bowler: {
        name:
          teamId === 1
            ? "Jasprit Bumrah"
            : teamId === 2
              ? "Pat Cummins"
              : teamId === 3
                ? "James Anderson"
                : "Top Bowler",
        photo: "/placeholder.svg?height=80&width=80",
        wickets: Math.floor(Math.random() * 10 + 15),
        average: (Math.random() * 10 + 18).toFixed(2),
        economy: (Math.random() * 2 + 4).toFixed(2),
        badges: ["Death specialist", "Yorker King"],
      },
      allRounder: {
        name:
          teamId === 1
            ? "Hardik Pandya"
            : teamId === 2
              ? "Glenn Maxwell"
              : teamId === 3
                ? "Ben Stokes"
                : "Top All-Rounder",
        photo: "/placeholder.svg?height=80&width=80",
        runs: Math.floor(Math.random() * 300 + 400),
        wickets: Math.floor(Math.random() * 8 + 8),
        strikeRate: (Math.random() * 30 + 100).toFixed(1),
        badges: ["Power hitter", "MVP"],
      },
    },
    teamStrength: {
      battingDepth: Math.floor(Math.random() * 20 + 75),
      strikeRate: Math.floor(Math.random() * 25 + 70),
      bowlingEconomy: Math.floor(Math.random() * 20 + 75),
      deathOvers: Math.floor(Math.random() * 25 + 70),
      fielding: Math.floor(Math.random() * 20 + 75),
    },
    rivalries: {
      odi: [
        {
          team: "Australia",
          flag: "🇦🇺",
          wins: Math.floor(Math.random() * 30 + 40),
          losses: Math.floor(Math.random() * 30 + 35),
          ties: Math.floor(Math.random() * 3),
        },
        {
          team: "England",
          flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          wins: Math.floor(Math.random() * 30 + 45),
          losses: Math.floor(Math.random() * 30 + 35),
          ties: Math.floor(Math.random() * 3),
        },
        {
          team: "Pakistan",
          flag: "🇵🇰",
          wins: Math.floor(Math.random() * 30 + 40),
          losses: Math.floor(Math.random() * 25 + 30),
          ties: Math.floor(Math.random() * 2),
        },
        {
          team: "South Africa",
          flag: "🇿🇦",
          wins: Math.floor(Math.random() * 25 + 35),
          losses: Math.floor(Math.random() * 25 + 30),
          ties: Math.floor(Math.random() * 4),
        },
        {
          team: "New Zealand",
          flag: "🇳🇿",
          wins: Math.floor(Math.random() * 30 + 45),
          losses: Math.floor(Math.random() * 20 + 20),
          ties: Math.floor(Math.random() * 2),
        },
      ],
      t20: [
        {
          team: "Australia",
          flag: "🇦🇺",
          wins: Math.floor(Math.random() * 10 + 10),
          losses: Math.floor(Math.random() * 10 + 8),
          ties: Math.floor(Math.random() * 2),
        },
        {
          team: "England",
          flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          wins: Math.floor(Math.random() * 8 + 8),
          losses: Math.floor(Math.random() * 8 + 6),
          ties: Math.floor(Math.random() * 1),
        },
        {
          team: "Pakistan",
          flag: "🇵🇰",
          wins: Math.floor(Math.random() * 6 + 6),
          losses: Math.floor(Math.random() * 6 + 4),
          ties: Math.floor(Math.random() * 2),
        },
        {
          team: "South Africa",
          flag: "🇿🇦",
          wins: Math.floor(Math.random() * 12 + 12),
          losses: Math.floor(Math.random() * 6 + 6),
          ties: Math.floor(Math.random() * 1),
        },
        {
          team: "New Zealand",
          flag: "🇳🇿",
          wins: Math.floor(Math.random() * 5 + 5),
          losses: Math.floor(Math.random() * 5 + 4),
          ties: Math.floor(Math.random() * 1),
        },
      ],
      test: [
        {
          team: "Australia",
          flag: "🇦🇺",
          wins: Math.floor(Math.random() * 20 + 25),
          losses: Math.floor(Math.random() * 25 + 35),
          ties: Math.floor(Math.random() * 3),
        },
        {
          team: "England",
          flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          wins: Math.floor(Math.random() * 20 + 25),
          losses: Math.floor(Math.random() * 25 + 35),
          ties: Math.floor(Math.random() * 2),
        },
        {
          team: "Pakistan",
          flag: "🇵🇰",
          wins: Math.floor(Math.random() * 8 + 8),
          losses: Math.floor(Math.random() * 6 + 6),
          ties: Math.floor(Math.random() * 3),
        },
        {
          team: "South Africa",
          flag: "🇿🇦",
          wins: Math.floor(Math.random() * 12 + 15),
          losses: Math.floor(Math.random() * 10 + 12),
          ties: Math.floor(Math.random() * 1),
        },
        {
          team: "New Zealand",
          flag: "🇳🇿",
          wins: Math.floor(Math.random() * 15 + 15),
          losses: Math.floor(Math.random() * 8 + 8),
          ties: Math.floor(Math.random() * 2),
        },
      ],
    },
  }
}

function TeamOverviewBanner({ team }: { team: ReturnType<typeof generateTeamData> }) {
  return (
    <Card className={`bg-gradient-to-r ${team.colors.primary} text-white shadow-2xl border-0`}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="flex items-center gap-4 flex-row flex-wrap justify-center lg:flex-row lg:justify-start lg:items-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl">{team.flag}</div>
              <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-2">{team.name}</h1>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <Badge className="bg-white/20 text-white hover:bg-white/30">ODI Rank #{team.rankings.odi}</Badge>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">T20 Rank #{team.rankings.t20}</Badge>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">Test Rank #{team.rankings.test}</Badge>
                </div>
              </div>
          </div>


          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold">{team.winPercentage}%</div>
              <div className="text-white/80">Win Rate</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-lg font-semibold flex items-center justify-center lg:justify-start gap-2">
                <Crown className="w-5 h-5" />
                {team.captain}
              </div>
              <div className="text-white/80">Captain</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-lg font-semibold flex items-center justify-center lg:justify-start gap-2">
                <Users className="w-5 h-5" />
                {team.coach}
              </div>
              <div className="text-white/80">Coach</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SquadGrid({ squad }: { squad: ReturnType<typeof generateTeamData>["squad"] }) {
  const roles = [
    { key: "batters", title: "Batters", icon: Target },
    { key: "bowlers", title: "Bowlers", icon: Zap },
    { key: "allRounders", title: "All-Rounders", icon: Star },
    { key: "wicketkeepers", title: "Wicketkeepers", icon: Shield },
  ]

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Team Squad
        </CardTitle>
        <CardDescription className="text-white/60">Complete squad with player roles and key statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {roles.map((role) => (
          <div key={role.key}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <role.icon className="w-5 h-5 text-green-400" />
              {role.title}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {squad[role.key as keyof typeof squad].map((player: any) => (
                <TooltipProvider key={player.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card className="bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 group hover:scale-105">
                        <CardContent className="p-4 text-center">
                          <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                            <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.name} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                              {player.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300 text-sm">
                            {player.name}
                          </h4>
                          <p className="text-xs text-white/60 mb-2">{player.stat}</p>
                        </CardContent>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{player.insight}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RecentFormTracker({ matches }: { matches: ReturnType<typeof generateTeamData>["recentMatches"] }) {
  const getResultIcon = (result: string) => {
    switch (result) {
      case "win":
        return <CheckCircle className="w-6 h-6 text-green-400" />
      case "loss":
        return <XCircle className="w-6 h-6 text-red-400" />
      default:
        return <Minus className="w-6 h-6 text-gray-400" />
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "win":
        return "border-green-500/50 bg-green-500/10"
      case "loss":
        return "border-red-500/50 bg-red-500/10"
      default:
        return "border-gray-500/50 bg-gray-500/10"
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-400" />
          Recent Form
        </CardTitle>
        <CardDescription className="text-white/60">Last 7 matches performance tracker</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {matches.map((match) => (
            <TooltipProvider key={match.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex-shrink-0 p-4 rounded-lg border-2 ${getResultColor(match.result)} hover:scale-105 transition-all duration-300 cursor-pointer min-w-[120px]`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{match.opponentFlag}</div>
                      <div className="flex justify-center mb-2">{getResultIcon(match.result)}</div>
                      <div className="text-xs text-white/80 font-medium">{match.opponent}</div>
                      <div className="text-xs text-white/60">{new Date(match.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {match.result === "win" ? "Won" : match.result === "loss" ? "Lost" : "No Result"} by {match.margin}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TopPerformers({ performers }: { performers: ReturnType<typeof generateTeamData>["topPerformers"] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Batter */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-orange-400" />
            Top Batter
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-orange-400/30">
            <AvatarImage src={performers.batter.photo || "/placeholder.svg"} alt={performers.batter.name} />
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg">
              {performers.batter.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-white mb-2">{performers.batter.name}</h3>
          <div className="space-y-2 mb-4">
            <div className="text-2xl font-bold text-orange-400">{performers.batter.runs}</div>
            <div className="text-sm text-white/60">Runs • Avg: {performers.batter.average}</div>
            <div className="text-sm text-white/60">SR: {performers.batter.strikeRate}</div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {performers.batter.badges.map((badge, index) => (
              <Badge key={index} className="bg-orange-500/20 text-orange-300 text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Bowler */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-blue-400" />
            Top Bowler
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-blue-400/30">
            <AvatarImage src={performers.bowler.photo || "/placeholder.svg"} alt={performers.bowler.name} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg">
              {performers.bowler.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-white mb-2">{performers.bowler.name}</h3>
          <div className="space-y-2 mb-4">
            <div className="text-2xl font-bold text-blue-400">{performers.bowler.wickets}</div>
            <div className="text-sm text-white/60">Wickets • Avg: {performers.bowler.average}</div>
            <div className="text-sm text-white/60">Eco: {performers.bowler.economy}</div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {performers.bowler.badges.map((badge, index) => (
              <Badge key={index} className="bg-blue-500/20 text-blue-300 text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top All-Rounder */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Star className="w-5 h-5 text-purple-400" />
            Top All-Rounder
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4 ring-4 ring-purple-400/30">
            <AvatarImage src={performers.allRounder.photo || "/placeholder.svg"} alt={performers.allRounder.name} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
              {performers.allRounder.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-white mb-2">{performers.allRounder.name}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-center gap-4">
              <div>
                <div className="text-lg font-bold text-purple-400">{performers.allRounder.runs}</div>
                <div className="text-xs text-white/60">Runs</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-400">{performers.allRounder.wickets}</div>
                <div className="text-xs text-white/60">Wickets</div>
              </div>
            </div>
            <div className="text-sm text-white/60">SR: {performers.allRounder.strikeRate}</div>
          </div>
          <div className="flex flex-wrap gap-1 justify-center">
            {performers.allRounder.badges.map((badge, index) => (
              <Badge key={index} className="bg-purple-500/20 text-purple-300 text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeamStrengthRadar({ strength }: { strength: ReturnType<typeof generateTeamData>["teamStrength"] }) {
  const data = {
    labels: ["Batting Depth", "Strike Rate", "Bowling Economy", "Death Overs", "Fielding"],
    datasets: [
      {
        label: "Team Strength",
        data: [
          strength.battingDepth,
          strength.strikeRate,
          strength.bowlingEconomy,
          strength.deathOvers,
          strength.fielding,
        ],
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(107, 114, 128, 0.2)",
        },
        pointLabels: {
          color: "rgb(255, 255, 255, 0.8)",
          font: {
            size: 12,
          },
        },
        ticks: {
          display: false,
        },
      },
    },
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe className="w-6 h-6 text-green-400" />
          Team Strength Analysis
        </CardTitle>
        <CardDescription className="text-white/60">Comprehensive team performance across key areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Radar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function RivalriesInsight({ rivalries }: { rivalries: ReturnType<typeof generateTeamData>["rivalries"] }) {
  const [selectedFormat, setSelectedFormat] = useState<"odi" | "t20" | "test">("odi")

  const currentRivalries = rivalries[selectedFormat]

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Rivalries Insight
            </CardTitle>
            <CardDescription className="text-white/60">
              Head-to-head records against major cricket nations
            </CardDescription>
          </div>
          <Tabs value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as any)}>
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="odi" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                ODI
              </TabsTrigger>
              <TabsTrigger value="t20" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                T20
              </TabsTrigger>
              <TabsTrigger value="test" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Test
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentRivalries.map((rivalry, index) => {
            const totalMatches = rivalry.wins + rivalry.losses + rivalry.ties
            const winPercentage = ((rivalry.wins / totalMatches) * 100).toFixed(1)

            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{rivalry.flag}</span>
                    <div>
                      <h4 className="font-semibold text-white">{rivalry.team}</h4>
                      <p className="text-sm text-white/60">{totalMatches} matches</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{winPercentage}%</div>
                    <div className="text-xs text-white/60">Win Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 rounded bg-green-500/20">
                    <div className="text-lg font-bold text-green-400">{rivalry.wins}</div>
                    <div className="text-xs text-white/60">Wins</div>
                  </div>
                  <div className="p-2 rounded bg-red-500/20">
                    <div className="text-lg font-bold text-red-400">{rivalry.losses}</div>
                    <div className="text-xs text-white/60">Losses</div>
                  </div>
                  <div className="p-2 rounded bg-gray-500/20">
                    <div className="text-lg font-bold text-gray-400">{rivalry.ties}</div>
                    <div className="text-xs text-white/60">Ties</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function TeamPage() {
  const [selectedTeamId, setSelectedTeamId] = useState(1)
  const teamData = generateTeamData(selectedTeamId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center  space-x-2 sm:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-white hover:bg-white/10 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Users className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Team Profile
                </h1>
                <p className="text-xs text-white/60 hidden md:block">Complete Team Analysis</p>
              </div>
            </div>

            {/* Team Search Bar */}
            <div className="lex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
              <TeamSearchBar onTeamSelect={setSelectedTeamId} />
             
            </div>
            <div className="hidden sm:block">
                <NavigationMenu currentPage="teams" />
              </div>
            <div className="sm:hidden">
                
              <NavigationMenu currentPage="teams" />

              </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
        {/* Team Overview Banner */}
        <TeamOverviewBanner team={teamData} />

        {/* Squad Grid */}
        <SquadGrid squad={teamData.squad} />

        {/* Recent Form Tracker */}
        <RecentFormTracker matches={teamData.recentMatches} />

        {/* Top Performers */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            Top Performers
          </h2>
          <TopPerformers performers={teamData.topPerformers} />
        </div>

        {/* Team Strength and Rivalries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TeamStrengthRadar strength={teamData.teamStrength} />
          <RivalriesInsight rivalries={teamData.rivalries} />
        </div>
      </main>
    </div>
  )
}
