"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
import { Radar, Line } from "react-chartjs-2"
import { Target, Award, Activity, TrendingUp, Flame, Crown, Users, BarChart3, Search, X, ArrowLeft } from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"
import Link from "next/link"

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

// Available Players Database
const availablePlayers = [
  {
    id: 1,
    name: "Virat Kohli",
    country: "India",
    countryFlag: "🇮🇳",
    role: "Right-Hand Batsman",
    searchTerms: ["virat", "kohli", "india", "batsman", "captain"],
  },
  {
    id: 2,
    name: "Babar Azam",
    country: "Pakistan",
    countryFlag: "🇵🇰",
    role: "Right-Hand Batsman",
    searchTerms: ["babar", "azam", "pakistan", "batsman", "captain"],
  },
  {
    id: 3,
    name: "Steve Smith",
    country: "Australia",
    countryFlag: "🇦🇺",
    role: "Right-Hand Batsman",
    searchTerms: ["steve", "smith", "australia", "batsman"],
  },
  {
    id: 4,
    name: "Joe Root",
    country: "England",
    countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    role: "Right-Hand Batsman",
    searchTerms: ["joe", "root", "england", "batsman", "captain"],
  },
  {
    id: 5,
    name: "Kane Williamson",
    country: "New Zealand",
    countryFlag: "🇳🇿",
    role: "Right-Hand Batsman",
    searchTerms: ["kane", "williamson", "new zealand", "batsman", "captain"],
  },
  {
    id: 6,
    name: "Jasprit Bumrah",
    country: "India",
    countryFlag: "🇮🇳",
    role: "Right-arm Fast Bowler",
    searchTerms: ["jasprit", "bumrah", "india", "bowler", "fast"],
  },
  {
    id: 7,
    name: "Pat Cummins",
    country: "Australia",
    countryFlag: "🇦🇺",
    role: "Right-arm Fast Bowler",
    searchTerms: ["pat", "cummins", "australia", "bowler", "fast", "captain"],
  },
  {
    id: 8,
    name: "Trent Boult",
    country: "New Zealand",
    countryFlag: "🇳🇿",
    role: "Left-arm Fast Bowler",
    searchTerms: ["trent", "boult", "new zealand", "bowler", "fast"],
  },
  {
    id: 9,
    name: "Rashid Khan",
    country: "Afghanistan",
    countryFlag: "🇦🇫",
    role: "Right-arm Leg Spinner",
    searchTerms: ["rashid", "khan", "afghanistan", "bowler", "spinner"],
  },
  {
    id: 10,
    name: "Ben Stokes",
    country: "England",
    countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    role: "All-Rounder",
    searchTerms: ["ben", "stokes", "england", "all-rounder", "captain"],
  },
  {
    id: 11,
    name: "Hardik Pandya",
    country: "India",
    countryFlag: "🇮🇳",
    role: "All-Rounder",
    searchTerms: ["hardik", "pandya", "india", "all-rounder"],
  },
  {
    id: 12,
    name: "Glenn Maxwell",
    country: "Australia",
    countryFlag: "🇦🇺",
    role: "All-Rounder",
    searchTerms: ["glenn", "maxwell", "australia", "all-rounder"],
  },
  {
    id: 13,
    name: "MS Dhoni",
    country: "India",
    countryFlag: "🇮🇳",
    role: "Wicket-Keeper Batsman",
    searchTerms: ["ms", "dhoni", "msd", "india", "wicket-keeper", "captain"],
  },
  {
    id: 14,
    name: "Jos Buttler",
    country: "England",
    countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    role: "Wicket-Keeper Batsman",
    searchTerms: ["jos", "buttler", "england", "wicket-keeper", "captain"],
  },
  {
    id: 15,
    name: "Quinton de Kock",
    country: "South Africa",
    countryFlag: "🇿🇦",
    role: "Wicket-Keeper Batsman",
    searchTerms: ["quinton", "de kock", "south africa", "wicket-keeper"],
  },
]

// Mock Player Data Generator
const generatePlayerData = (playerId: number) => {
  const player = availablePlayers.find((p) => p.id === playerId) || availablePlayers[0]

  return {
    id: playerId,
    name: player.name,
    photo: "/placeholder.svg?height=120&width=120",
    country: player.country,
    countryFlag: player.countryFlag,
    role: player.role,
    matches: Math.floor(Math.random() * 200) + 100,
    runs: Math.floor(Math.random() * 8000) + 4000,
    wickets: Math.floor(Math.random() * 150) + 50,
    debut: "2008-08-18",
    currentAge: Math.floor(Math.random() * 15) + 25,
    battingAverage: (Math.random() * 30 + 35).toFixed(2),
    strikeRate: (Math.random() * 40 + 80).toFixed(2),
    centuries: Math.floor(Math.random() * 30) + 10,
    fifties: Math.floor(Math.random() * 40) + 20,
    highestScore: Math.floor(Math.random() * 100) + 150,
    skills: {
      average: Math.floor(Math.random() * 30) + 70,
      strikeRate: Math.floor(Math.random() * 30) + 60,
      boundaryPercentage: Math.floor(Math.random() * 30) + 65,
      centuries: Math.floor(Math.random() * 30) + 70,
      pressurePerformance: Math.floor(Math.random() * 30) + 75,
    },
    careerMomentum: [
      { year: 2008, runs: 159, matches: 5, milestone: "Debut" },
      { year: 2009, runs: 325, matches: 8, milestone: null },
      { year: 2010, runs: 995, matches: 14, milestone: "First Century" },
      { year: 2011, runs: 1381, matches: 19, milestone: "World Cup Winner" },
      { year: 2012, runs: 1733, matches: 22, milestone: "Peak Form" },
      { year: 2013, runs: 1268, matches: 16, milestone: null },
      { year: 2014, runs: 1054, matches: 13, milestone: null },
      { year: 2015, runs: 1215, matches: 15, milestone: null },
      { year: 2016, runs: 2595, matches: 27, milestone: "Career Best Year" },
      { year: 2017, runs: 1460, matches: 18, milestone: null },
      { year: 2018, runs: 2735, matches: 28, milestone: "Peak Performance" },
      { year: 2019, runs: 2455, matches: 26, milestone: null },
      { year: 2020, runs: 442, matches: 6, milestone: null },
      { year: 2021, runs: 619, matches: 8, milestone: null },
      { year: 2022, runs: 1115, matches: 13, milestone: null },
      { year: 2023, runs: 1377, matches: 16, milestone: "Return to Form" },
    ],
    shotZones: [
      { zone: "Cover Drive", frequency: 25, runs: Math.floor(Math.random() * 1000) + 2000 },
      { zone: "Straight Drive", frequency: 20, runs: Math.floor(Math.random() * 1000) + 1800 },
      { zone: "Pull Shot", frequency: 15, runs: Math.floor(Math.random() * 800) + 1200 },
      { zone: "Cut Shot", frequency: 12, runs: Math.floor(Math.random() * 600) + 1000 },
      { zone: "Flick", frequency: 18, runs: Math.floor(Math.random() * 900) + 1500 },
      { zone: "Square Drive", frequency: 10, runs: Math.floor(Math.random() * 500) + 800 },
    ],
    badges: [
      {
        id: 1,
        name: "Chase Master",
        icon: Target,
        description: "Averages 65+ when chasing targets",
        color: "bg-green-500",
      },
      {
        id: 2,
        name: "Pressure Player",
        icon: Flame,
        description: "Performs exceptionally under pressure",
        color: "bg-red-500",
      },
      {
        id: 3,
        name: "Century Machine",
        icon: Crown,
        description: "Multiple international centuries",
        color: "bg-yellow-500",
      },
      {
        id: 4,
        name: "Consistency King",
        icon: TrendingUp,
        description: "Maintains high average across formats",
        color: "bg-blue-500",
      },
    ],
    teamStats: [
      { team: "Australia", matches: 45, runs: 2654, average: 58.98, status: "excellent" },
      { team: "England", matches: 38, runs: 2145, average: 56.45, status: "good" },
      { team: "South Africa", matches: 32, runs: 1876, average: 58.62, status: "excellent" },
      { team: "Pakistan", matches: 28, runs: 1543, average: 55.11, status: "good" },
      { team: "New Zealand", matches: 25, runs: 1432, average: 57.28, status: "excellent" },
      { team: "West Indies", matches: 22, runs: 1298, average: 59.0, status: "excellent" },
    ],
    bowlerMatchups: [
      { bowler: "Pat Cummins", matches: 12, runs: 234, average: 19.5, status: "struggle" },
      { bowler: "Jasprit Bumrah", matches: 8, runs: 156, average: 19.5, status: "struggle" },
      { bowler: "Trent Boult", matches: 15, runs: 387, average: 25.8, status: "average" },
      { bowler: "Kagiso Rabada", matches: 18, runs: 542, average: 30.11, status: "good" },
      { bowler: "Mitchell Starc", matches: 20, runs: 678, average: 33.9, status: "excellent" },
    ],
  }
}

function PlayerSearchBar({ onPlayerSelect }: { onPlayerSelect: (playerId: number) => void }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<typeof availablePlayers>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = availablePlayers.filter((player) =>
        player.searchTerms.some((term) => term.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setSuggestions(filtered.slice(0, 8))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handlePlayerSelect = (player: (typeof availablePlayers)[0]) => {
    setSearchTerm(player.name)
    setShowSuggestions(false)
    onPlayerSelect(player.id)
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
      <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 transition-all duration-300 text-sm"
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
            {suggestions.map((player, index) => (
              <button
                key={player.id}
                onClick={() => handlePlayerSelect(player)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-white/20 transition-all duration-300 text-left group hover:scale-[1.02] ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${index === suggestions.length - 1 ? "rounded-b-xl border-b-0" : "border-b border-white/10"}`}
              >
                <Avatar className="h-12 w-12 ring-2 ring-white/30 group-hover:ring-white/50 transition-all duration-300 group-hover:scale-110">
                  <AvatarImage src="/placeholder.svg" alt={player.name} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold">
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                      {player.name}
                    </span>
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {player.countryFlag}
                    </span>
                  </div>
                  <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 font-medium">
                    {player.country}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                </div>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}

function PlayerHeader({ player }: { player: ReturnType<typeof generatePlayerData> }) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-white/30">
            <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.name} />
            <AvatarFallback className="bg-white/20 text-white text-2xl">
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-4xl font-bold text-white/80">{player.name}</h1>
              <span className="text-2xl text-white/80">{player.countryFlag}</span>
              <Badge className="bg-white/20 text-white hover:bg-white/30 w-fit mx-auto md:mx-0">{player.country}</Badge>
            </div>

            <p className="text-lg text-white/90 mb-4">{player.role}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white/80">{player.matches}</div>
                <div className="text-sm text-white/60">Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white/80">{player.runs.toLocaleString()}</div>
                <div className="text-sm text-white/60">Runs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white/80">{player.battingAverage}</div>
                <div className="text-sm text-white/60">Average</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white/80">{new Date(player.debut).getFullYear()}</div>
                <div className="text-sm text-white/60">Debut</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillRadarChart({ skills }: { skills: ReturnType<typeof generatePlayerData>["skills"] }) {
  const data = {
    labels: ["Average", "Strike Rate", "Boundary %", "Centuries", "Pressure Performance"],
    datasets: [
      {
        label: "Player Skills",
        data: [
          skills.average,
          skills.strikeRate,
          skills.boundaryPercentage,
          skills.centuries,
          skills.pressurePerformance,
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
          color: "rgb(107, 114, 128)",
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
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
          <Activity className="w-5 h-5 text-green-500" />
          Skill Distribution
        </CardTitle>
        <CardDescription className="text-white/60 text-xs sm:text-sm">
          Performance metrics across key batting areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Radar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function MomentumChart({ momentum }: { momentum: ReturnType<typeof generatePlayerData>["careerMomentum"] }) {
  const data = {
    labels: momentum.map((m) => m.year.toString()),
    datasets: [
      {
        label: "Runs per Year",
        data: momentum.map((m) => m.runs),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: momentum.map((m) => (m.milestone ? "rgba(239, 68, 68, 1)" : "rgba(59, 130, 246, 1)")),
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: momentum.map((m) => (m.milestone ? 8 : 4)),
        pointHoverRadius: 10,
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
      tooltip: {
        callbacks: {
          afterBody: (context: any) => {
            const index = context[0].dataIndex
            const milestone = momentum[index].milestone
            return milestone ? `Milestone: ${milestone}` : ""
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          color: "rgb(107, 114, 128)",
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          color: "rgb(107, 114, 128)",
        },
      },
    },
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Career Momentum
        </CardTitle>
        <CardDescription className="text-white/60 text-xs sm:text-sm">
          Performance trajectory over the years
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {momentum
            .filter((m) => m.milestone)
            .map((m, index) => (
              <Badge
                key={index}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white border-0 text-xs"
              >
                {m.year}: {m.milestone}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ShotZoneHeatmap({ zones }: { zones: ReturnType<typeof generatePlayerData>["shotZones"] }) {
  const maxRuns = Math.max(...zones.map((z) => z.runs))

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
          <Target className="w-5 h-5 text-purple-500" />
          Shot Zone Analysis
        </CardTitle>
        <CardDescription className="text-white/60 text-xs sm:text-sm">
          Preferred scoring areas and shot distribution
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <div className="flex-1 mb-2 sm:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white/80 text-sm sm:text-base">{zone.zone}</span>
                  <span className="text-xs sm:text-sm text-white/60">{zone.runs} runs</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(zone.runs / maxRuns) * 100}%` }}
                  />
                </div>
              </div>
              <div className="ml-0 sm:ml-4 text-left sm:text-right">
                <div className="text-lg font-bold text-white/80">{zone.frequency}%</div>
                <div className="text-xs text-white/60">frequency</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PlayerBadges({ badges }: { badges: ReturnType<typeof generatePlayerData>["badges"] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
          <Award className="w-5 h-5 text-yellow-400" />
          Player Insights
        </CardTitle>
        <CardDescription className="text-white/60 text-xs sm:text-sm">Special traits and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {badges.map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 group">
                    <div
                      className={`p-2 rounded-full ${badge.color} text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      <badge.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white/80 text-sm sm:text-base group-hover:text-white transition-colors duration-300">
                        {badge.name}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300 truncate">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badge.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MatchupInsights({
  teamStats,
  bowlerMatchups,
}: {
  teamStats: ReturnType<typeof generatePlayerData>["teamStats"]
  bowlerMatchups: ReturnType<typeof generatePlayerData>["bowlerMatchups"]
}) {
  const [viewType, setViewType] = useState<"teams" | "bowlers">("teams")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-400 bg-green-500/20 border-green-500/30"
      case "good":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30"
      case "average":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "struggle":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Matchup Insights
            </CardTitle>
            <CardDescription className="text-white/60 text-xs sm:text-sm">
              Performance against teams and specific bowlers
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              variant={viewType === "teams" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("teams")}
              className={`flex-1 sm:flex-none text-xs sm:text-sm ${
                viewType === "teams"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                  : "border-white/20 text-white hover:bg-white/10 hover:border-white//40 bg-transparent"
              }`}
            >
              vs Teams
            </Button>
            <Button
              variant={viewType === "bowlers" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewType("bowlers")}
              className={`flex-1 sm:flex-none text-xs sm:text-sm ${
                viewType === "bowlers"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                  : "border-white/20 text-white hover:bg-white/10 hover:border-white/40 bg-transparent"
              }`}
            >
              vs Bowlers
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {viewType === "teams"
            ? teamStats.map((team, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 space-y-2 sm:space-y-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="font-medium text-white/80 text-sm sm:text-base">{team.team}</div>
                    <Badge className={`text-xs w-fit ${getStatusColor(team.status)} border`}>{team.status}</Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-bold text-white/80 text-sm sm:text-base">{team.average}</div>
                    <div className="text-xs text-white/60">{team.matches} matches</div>
                  </div>
                </div>
              ))
            : bowlerMatchups.map((matchup, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 space-y-2 sm:space-y-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="font-medium text-white/80 text-sm sm:text-base">{matchup.bowler}</div>
                    <Badge className={`text-xs w-fit ${getStatusColor(matchup.status)} border`}>{matchup.status}</Badge>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-bold text-white/80 text-sm sm:text-base">{matchup.average}</div>
                    <div className="text-xs text-white/60">{matchup.matches} matches</div>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlayerProfile() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedPlayerId, setSelectedPlayerId] = useState(1)
  const playerData = generatePlayerData(selectedPlayerId)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-2 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-white hover:bg-white/10 p-2 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Player Profile
                </h1>
                <p className="text-xs text-white/60 hidden md:block">Detailed Analytics</p>
              </div>
            </div>

            {/* Center Section - Search Bar */}
            <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
              <PlayerSearchBar onPlayerSelect={setSelectedPlayerId} />
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
              <Link href="/player/compare" passHref>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 bg-transparent flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 md:px-4 py-1 sm:py-2"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Compare</span>
                  <span className="sm:hidden">VS</span>
                </Button>
              </Link>
              <div className="hidden sm:block">
                <NavigationMenu currentPage="players" />
              </div>
              {/* Mobile Navigation Menu */}
              <div className="sm:hidden">
                <NavigationMenu currentPage="players" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 relative z-10">
        {/* Player Header */}
        <PlayerHeader player={playerData} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Skill Radar Chart */}
          <SkillRadarChart skills={playerData.skills} />

          {/* Player Badges */}
          <PlayerBadges badges={playerData.badges} />
        </div>

        {/* Career Momentum Chart */}
        <MomentumChart momentum={playerData.careerMomentum} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Shot Zone Heatmap */}
          <ShotZoneHeatmap zones={playerData.shotZones} />

          {/* Matchup Insights */}
          <MatchupInsights teamStats={playerData.teamStats} bowlerMatchups={playerData.bowlerMatchups} />
        </div>
      </main>
    </div>
  )
}
