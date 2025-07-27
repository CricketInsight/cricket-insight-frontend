"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NavigationMenu } from "@/components/navigation-menu"
import { ChartViewer } from "@/components/chart-viewer"
import { DataTable } from "@/components/data-table"
import { DataTableAdvanced } from "@/components/data-table-advanced"
import { MultiSelect } from "@/components/multi-select"
import {
  Send,
  Bot,
  User,
  CalendarIcon,
  Loader2,
  Sparkles,
  Trophy,
  Users,
  FileText,
  Activity,
  Brain,
  Search,
  Download,
  Eye,
  BarChart3,
  Filter,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  data?: any
  chartType?: "bar" | "line" | "pie" | "area"
}

interface FilterState {
  players: string[]
  matchTypes: string[]
  dateFrom?: Date
  dateTo?: Date
  statistics: string[]
  venues: string[]
  teams: string[]
  tournaments: string[]
  seasons: string[]
  innings: string[]
  overs: string[]
  bowlingStyles: string[]
  battingPositions: string[]
}

type MenuTab = "matches" | "players" | "scorecard" | "ballbyball" | "aiinsight"

const SAMPLE_PLAYERS = [
  "Virat Kohli",
  "Rohit Sharma",
  "KL Rahul",
  "Hardik Pandya",
  "Babar Azam",
  "Mohammad Rizwan",
  "Kane Williamson",
  "David Warner",
  "Steve Smith",
  "Joe Root",
  "Ben Stokes",
  "Trent Boult",
  "Jasprit Bumrah",
  "Pat Cummins",
  "Kagiso Rabada",
]

const MATCH_TYPES = ["Test", "ODI", "T20I", "IPL", "PSL", "BBL", "CPL", "The Hundred", "T10"]
const VENUES = [
  "Lord's",
  "Eden Gardens",
  "MCG",
  "Wankhede Stadium",
  "The Oval",
  "SCG",
  "Old Trafford",
  "Gaddafi Stadium",
  "Dubai International Stadium",
  "Sharjah Cricket Stadium",
  "Adelaide Oval",
  "Headingley",
  "Trent Bridge",
  "The Gabba",
  "WACA",
]
const TEAMS = [
  "India",
  "Pakistan",
  "Australia",
  "England",
  "New Zealand",
  "South Africa",
  "West Indies",
  "Sri Lanka",
  "Bangladesh",
  "Afghanistan",
  "Ireland",
  "Scotland",
]
const TOURNAMENTS = [
  "World Cup",
  "Champions Trophy",
  "Asia Cup",
  "IPL",
  "PSL",
  "BBL",
  "CPL",
  "T20 World Cup",
  "WTC Final",
  "Ashes",
  "Border-Gavaskar Trophy",
  "The Hundred",
]
const SEASONS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]
const INNINGS = ["1st Innings", "2nd Innings", "3rd Innings", "4th Innings"]
const OVERS = ["Powerplay (1-6)", "Middle (7-15)", "Death (16-20)", "All Overs", "First 10 Overs", "Last 10 Overs"]
const BOWLING_STYLES = [
  "Fast",
  "Medium",
  "Spin",
  "Left-arm Fast",
  "Right-arm Fast",
  "Left-arm Spin",
  "Right-arm Spin",
  "Off-spin",
  "Leg-spin",
]
const BATTING_POSITIONS = [
  "Top Order (1-3)",
  "Middle Order (4-6)",
  "Lower Order (7-11)",
  "Opener",
  "No. 3",
  "No. 4",
  "No. 5",
  "No. 6",
  "Tail-ender",
]
const STATISTICS = [
  "Runs",
  "Wickets",
  "Average",
  "Strike Rate",
  "Economy",
  "Centuries",
  "Half Centuries",
  "Catches",
  "Stumpings",
  "Run Outs",
]

// Sample data for different tabs
const SAMPLE_MATCHES = [
  {
    id: 1,
    team1: "India",
    team2: "Pakistan",
    date: "2024-01-15",
    venue: "Eden Gardens",
    format: "ODI",
    result: "India won by 5 wickets",
    tournament: "Asia Cup",
    season: "2024",
  },
  {
    id: 2,
    team1: "Australia",
    team2: "England",
    date: "2024-01-12",
    venue: "MCG",
    format: "Test",
    result: "Australia won by 10 wickets",
    tournament: "Ashes",
    season: "2024",
  },
  {
    id: 3,
    team1: "New Zealand",
    team2: "South Africa",
    date: "2024-01-10",
    venue: "Lord's",
    format: "T20I",
    result: "New Zealand won by 15 runs",
    tournament: "Bilateral Series",
    season: "2024",
  },
  {
    id: 4,
    team1: "West Indies",
    team2: "Sri Lanka",
    date: "2024-01-08",
    venue: "Sharjah Cricket Stadium",
    format: "ODI",
    result: "West Indies won by 25 runs",
    tournament: "Bilateral Series",
    season: "2024",
  },
  {
    id: 5,
    team1: "Bangladesh",
    team2: "Afghanistan",
    date: "2024-01-05",
    venue: "Dubai International Stadium",
    format: "T20I",
    result: "Afghanistan won by 7 wickets",
    tournament: "Asia Cup",
    season: "2024",
  },
]

const SAMPLE_PLAYERS_DATA = [
  {
    id: 1,
    name: "Virat Kohli",
    team: "India",
    matches: 254,
    runs: 12169,
    average: 57.32,
    strikeRate: 93.17,
    centuries: 43,
    position: "Top Order",
    role: "Batsman",
  },
  {
    id: 2,
    name: "Babar Azam",
    team: "Pakistan",
    matches: 102,
    runs: 4442,
    average: 56.83,
    strikeRate: 88.2,
    centuries: 17,
    position: "Top Order",
    role: "Batsman",
  },
  {
    id: 3,
    name: "Kane Williamson",
    team: "New Zealand",
    matches: 151,
    runs: 6173,
    average: 47.48,
    strikeRate: 81.54,
    centuries: 13,
    position: "Top Order",
    role: "Batsman",
  },
  {
    id: 4,
    name: "Steve Smith",
    team: "Australia",
    matches: 128,
    runs: 4378,
    average: 42.84,
    strikeRate: 87.89,
    centuries: 11,
    position: "Top Order",
    role: "Batsman",
  },
  {
    id: 5,
    name: "Joe Root",
    team: "England",
    matches: 156,
    runs: 6109,
    average: 47.36,
    strikeRate: 86.45,
    centuries: 16,
    position: "Top Order",
    role: "Batsman",
  },
]

const SAMPLE_SCORECARD = [
  {
    id: 1,
    player: "Rohit Sharma",
    runs: 85,
    balls: 92,
    fours: 8,
    sixes: 2,
    strikeRate: 92.39,
    status: "not out",
    position: 1,
    innings: "1st Innings",
  },
  {
    id: 2,
    player: "Virat Kohli",
    runs: 67,
    balls: 78,
    fours: 6,
    sixes: 1,
    strikeRate: 85.9,
    status: "c Smith b Anderson",
    position: 3,
    innings: "1st Innings",
  },
  {
    id: 3,
    player: "KL Rahul",
    runs: 34,
    balls: 45,
    fours: 4,
    sixes: 0,
    strikeRate: 75.56,
    status: "lbw b Broad",
    position: 2,
    innings: "1st Innings",
  },
  {
    id: 4,
    player: "Hardik Pandya",
    runs: 42,
    balls: 28,
    fours: 3,
    sixes: 2,
    strikeRate: 150.0,
    status: "c Root b Stokes",
    position: 6,
    innings: "1st Innings",
  },
  {
    id: 5,
    player: "Rishabh Pant",
    runs: 28,
    balls: 35,
    fours: 2,
    sixes: 1,
    strikeRate: 80.0,
    status: "b Wood",
    position: 5,
    innings: "1st Innings",
  },
]

const SAMPLE_BALL_BY_BALL = [
  {
    id: 1,
    over: "1.1",
    bowler: "J Anderson",
    batsman: "R Sharma",
    runs: 1,
    extras: 0,
    total: "1/0",
    commentary: "Good length delivery, pushed to mid-on for a single",
    bowlingStyle: "Fast",
    phase: "Powerplay",
  },
  {
    id: 2,
    over: "1.2",
    bowler: "J Anderson",
    batsman: "V Kohli",
    runs: 0,
    extras: 0,
    total: "1/0",
    commentary: "Pitched up, driven straight to cover",
    bowlingStyle: "Fast",
    phase: "Powerplay",
  },
  {
    id: 3,
    over: "1.3",
    bowler: "J Anderson",
    batsman: "V Kohli",
    runs: 4,
    extras: 0,
    total: "5/0",
    commentary: "Short and wide, cut away through point for four",
    bowlingStyle: "Fast",
    phase: "Powerplay",
  },
  {
    id: 4,
    over: "2.1",
    bowler: "S Broad",
    batsman: "R Sharma",
    runs: 0,
    extras: 0,
    total: "5/0",
    commentary: "Full delivery, defended back to the bowler",
    bowlingStyle: "Fast",
    phase: "Powerplay",
  },
  {
    id: 5,
    over: "2.2",
    bowler: "S Broad",
    batsman: "R Sharma",
    runs: 6,
    extras: 0,
    total: "11/0",
    commentary: "Short ball, pulled over square leg for six",
    bowlingStyle: "Fast",
    phase: "Powerplay",
  },
]

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>("matches")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [filters, setFilters] = useState<FilterState>({
    players: [],
    matchTypes: [],
    statistics: [],
    venues: [],
    teams: [],
    tournaments: [],
    seasons: [],
    innings: [],
    overs: [],
    bowlingStyles: [],
    battingPositions: [],
  })

  // AI Chat states (for aiinsight tab)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your cricket data analyst. Ask me anything about cricket statistics, player performances, or match insights.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    { id: "matches" as MenuTab, label: "Matches", icon: Trophy },
    { id: "players" as MenuTab, label: "Players", icon: Users },
    { id: "scorecard" as MenuTab, label: "Scorecard", icon: FileText },
    { id: "ballbyball" as MenuTab, label: "Ball by Ball", icon: Activity },
    { id: "aiinsight" as MenuTab, label: "AI Insight", icon: Brain },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateMockResponse = (
    query: string,
  ): { content: string; data?: any; chartType?: "bar" | "line" | "pie" | "area" } => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("virat") && lowerQuery.includes("centur")) {
      return {
        content:
          "Here's Virat Kohli's ODI centuries by year. He has been remarkably consistent, with peak performance between 2016-2019.",
        data: [
          { year: "2012", centuries: 5, matches: 31 },
          { year: "2013", centuries: 8, matches: 26 },
          { year: "2014", centuries: 6, matches: 19 },
          { year: "2015", centuries: 4, matches: 13 },
          { year: "2016", centuries: 9, matches: 19 },
          { year: "2017", centuries: 11, matches: 26 },
          { year: "2018", centuries: 6, matches: 14 },
          { year: "2019", centuries: 5, matches: 26 },
        ],
        chartType: "bar",
      }
    }

    return {
      content:
        "Here's a breakdown of your cricket query categories. I can help you analyze player statistics, match data, team performance, and historical trends.",
      data: [
        { category: "Batting Stats", value: 35, color: "#8884d8" },
        { category: "Bowling Stats", value: 25, color: "#82ca9d" },
        { category: "Team Analysis", value: 20, color: "#ffc658" },
        { category: "Match Insights", value: 15, color: "#ff7300" },
        { category: "Historical Data", value: 5, color: "#00ff88" },
      ],
      chartType: "pie",
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const response = generateMockResponse(input)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.content,
        timestamp: new Date(),
        data: response.data,
        chartType: response.chartType,
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearAllFilters = () => {
    setFilters({
      players: [],
      matchTypes: [],
      statistics: [],
      venues: [],
      teams: [],
      tournaments: [],
      seasons: [],
      innings: [],
      overs: [],
      bowlingStyles: [],
      battingPositions: [],
    })
  }

  const getActionButtons = () => {
    if (selectedItems.length === 0) return null

    switch (activeTab) {
      case "matches":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Activity className="w-4 h-4 mr-2" />
              Get Ball by Ball Data
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              AI Insight
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 px-3 py-1">
              {selectedItems.length} selected
            </Badge>
          </div>
        )
      case "players":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Compare Players
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 px-3 py-1">
              {selectedItems.length} selected
            </Badge>
          </div>
        )
      case "scorecard":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              Performance Analysis
            </Button>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 px-3 py-1">
              {selectedItems.length} selected
            </Badge>
          </div>
        )
      case "ballbyball":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              <Activity className="w-4 h-4 mr-2" />
              Analyze Sequence
            </Button>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Brain className="w-4 h-4 mr-2" />
              AI Insight
            </Button>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 px-3 py-1">
              {selectedItems.length} selected
            </Badge>
          </div>
        )
      default:
        return null
    }
  }

  const getFiltersForTab = () => {
    const commonFilters = (
      <>
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-white mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm font-medium text-white mb-2 block">Date Range</label>
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : "From date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, dateFrom: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : "To date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, dateTo: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </>
    )

    switch (activeTab) {
      case "matches":
        return (
          <>
            {commonFilters}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Match Types</label>
              <MultiSelect
                options={MATCH_TYPES}
                selected={filters.matchTypes}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, matchTypes: selected }))}
                placeholder="Select match types"
                searchPlaceholder="Search match types..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Teams</label>
              <MultiSelect
                options={TEAMS}
                selected={filters.teams}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, teams: selected }))}
                placeholder="Select teams"
                searchPlaceholder="Search teams..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Venues</label>
              <MultiSelect
                options={VENUES}
                selected={filters.venues}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, venues: selected }))}
                placeholder="Select venues"
                searchPlaceholder="Search venues..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Tournaments</label>
              <MultiSelect
                options={TOURNAMENTS}
                selected={filters.tournaments}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, tournaments: selected }))}
                placeholder="Select tournaments"
                searchPlaceholder="Search tournaments..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Seasons</label>
              <MultiSelect
                options={SEASONS}
                selected={filters.seasons}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, seasons: selected }))}
                placeholder="Select seasons"
                searchPlaceholder="Search seasons..."
              />
            </div>
          </>
        )

      case "players":
        return (
          <>
            {commonFilters}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Players</label>
              <MultiSelect
                options={SAMPLE_PLAYERS}
                selected={filters.players}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, players: selected }))}
                placeholder="Select players"
                searchPlaceholder="Search players..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Teams</label>
              <MultiSelect
                options={TEAMS}
                selected={filters.teams}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, teams: selected }))}
                placeholder="Select teams"
                searchPlaceholder="Search teams..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Batting Position</label>
              <MultiSelect
                options={BATTING_POSITIONS}
                selected={filters.battingPositions}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, battingPositions: selected }))}
                placeholder="Select positions"
                searchPlaceholder="Search positions..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Statistics</label>
              <MultiSelect
                options={STATISTICS}
                selected={filters.statistics}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, statistics: selected }))}
                placeholder="Select statistics"
                searchPlaceholder="Search statistics..."
              />
            </div>
          </>
        )

      case "scorecard":
        return (
          <>
            {commonFilters}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Innings</label>
              <MultiSelect
                options={INNINGS}
                selected={filters.innings}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, innings: selected }))}
                placeholder="Select innings"
                searchPlaceholder="Search innings..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Batting Position</label>
              <MultiSelect
                options={BATTING_POSITIONS}
                selected={filters.battingPositions}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, battingPositions: selected }))}
                placeholder="Select positions"
                searchPlaceholder="Search positions..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Players</label>
              <MultiSelect
                options={SAMPLE_PLAYERS}
                selected={filters.players}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, players: selected }))}
                placeholder="Select players"
                searchPlaceholder="Search players..."
              />
            </div>
          </>
        )

      case "ballbyball":
        return (
          <>
            {commonFilters}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Over Phase</label>
              <MultiSelect
                options={OVERS}
                selected={filters.overs}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, overs: selected }))}
                placeholder="Select phases"
                searchPlaceholder="Search phases..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Bowling Style</label>
              <MultiSelect
                options={BOWLING_STYLES}
                selected={filters.bowlingStyles}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, bowlingStyles: selected }))}
                placeholder="Select styles"
                searchPlaceholder="Search styles..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Players</label>
              <MultiSelect
                options={SAMPLE_PLAYERS}
                selected={filters.players}
                onSelectionChange={(selected) => setFilters((prev) => ({ ...prev, players: selected }))}
                placeholder="Select players"
                searchPlaceholder="Search players..."
              />
            </div>
          </>
        )

      default:
        return commonFilters
    }
  }

  const renderFilters = () => {
    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={clearAllFilters}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {getFiltersForTab()}
          <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600">Apply Filters</Button>
        </CardContent>
      </Card>
    )
  }

  const getColumnsForTab = () => {
    switch (activeTab) {
      case "matches":
        return [
          { id: "team1", label: "Team 1", visible: true, sortable: true, type: "text" },
          { id: "team2", label: "Team 2", visible: true, sortable: true, type: "text" },
          { id: "date", label: "Date", visible: true, sortable: true, type: "date" },
          { id: "venue", label: "Venue", visible: true, sortable: true, type: "text" },
          { id: "format", label: "Format", visible: true, sortable: true, type: "badge" },
          { id: "result", label: "Result", visible: true, sortable: false, type: "text" },
          { id: "tournament", label: "Tournament", visible: false, sortable: true, type: "text" },
          { id: "season", label: "Season", visible: false, sortable: true, type: "text" },
        ]
      case "players":
        return [
          { id: "name", label: "Name", visible: true, sortable: true, type: "text" },
          { id: "team", label: "Team", visible: true, sortable: true, type: "text" },
          { id: "matches", label: "Matches", visible: true, sortable: true, type: "number" },
          { id: "runs", label: "Runs", visible: true, sortable: true, type: "number" },
          { id: "average", label: "Average", visible: true, sortable: true, type: "number" },
          { id: "strikeRate", label: "Strike Rate", visible: true, sortable: true, type: "number" },
          { id: "centuries", label: "Centuries", visible: true, sortable: true, type: "number" },
          { id: "position", label: "Position", visible: false, sortable: true, type: "text" },
          { id: "role", label: "Role", visible: false, sortable: true, type: "text" },
        ]
      case "scorecard":
        return [
          { id: "player", label: "Player", visible: true, sortable: true, type: "text" },
          { id: "runs", label: "Runs", visible: true, sortable: true, type: "number" },
          { id: "balls", label: "Balls", visible: true, sortable: true, type: "number" },
          { id: "fours", label: "4s", visible: true, sortable: true, type: "number" },
          { id: "sixes", label: "6s", visible: true, sortable: true, type: "number" },
          { id: "strikeRate", label: "Strike Rate", visible: true, sortable: true, type: "number" },
          { id: "status", label: "Status", visible: true, sortable: false, type: "text" },
          { id: "position", label: "Position", visible: false, sortable: true, type: "number" },
          { id: "innings", label: "Innings", visible: false, sortable: true, type: "text" },
        ]
      case "ballbyball":
        return [
          { id: "over", label: "Over", visible: true, sortable: true, type: "text" },
          { id: "bowler", label: "Bowler", visible: true, sortable: true, type: "text" },
          { id: "batsman", label: "Batsman", visible: true, sortable: true, type: "text" },
          { id: "runs", label: "Runs", visible: true, sortable: true, type: "number" },
          { id: "total", label: "Total", visible: true, sortable: false, type: "text" },
          { id: "commentary", label: "Commentary", visible: true, sortable: false, type: "text" },
          { id: "bowlingStyle", label: "Bowling Style", visible: false, sortable: true, type: "text" },
          { id: "phase", label: "Phase", visible: false, sortable: true, type: "text" },
        ]
      default:
        return []
    }
  }

  const getDataForTab = () => {
    switch (activeTab) {
      case "matches":
        return SAMPLE_MATCHES
      case "players":
        return SAMPLE_PLAYERS_DATA
      case "scorecard":
        return SAMPLE_SCORECARD
      case "ballbyball":
        return SAMPLE_BALL_BY_BALL
      default:
        return []
    }
  }

  const renderAIInsight = () => {
    return (
      <div className="space-y-6">
        {/* Chat Messages */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-gradient-to-r from-green-500 to-blue-600"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white/10 backdrop-blur-lg border border-white/20 text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">{format(message.timestamp, "HH:mm")}</p>

                  {/* Chart and Data Display */}
                  {message.data && message.chartType && (
                    <div className="mt-4 space-y-4">
                      <ChartViewer data={message.data} type={message.chartType} />
                      <DataTable data={message.data} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Message */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-green-500 to-blue-600">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-lg p-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">Analyzing cricket data...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about cricket statistics, player performance, or match insights..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Cricket Insights</h1>
            </div>
            <NavigationMenu currentPage="insights" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Menu Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setActiveTab(item.id)
                  setSelectedItems([])
                }}
                className={`
                  transition-all duration-300
                  ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg"
                      : "text-white hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            )
          })}
        </div>

        {/* Action Buttons */}
        {getActionButtons()}

        {/* Content Area */}
        {activeTab === "aiinsight" ? (
          renderAIInsight()
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">{renderFilters()}</div>

            {/* Right Content - Advanced Data Table */}
            <div className="lg:col-span-3">
              <DataTableAdvanced
                data={getDataForTab()}
                columns={getColumnsForTab()}
                onSelectionChange={setSelectedItems}
                selectedItems={selectedItems}
                title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
