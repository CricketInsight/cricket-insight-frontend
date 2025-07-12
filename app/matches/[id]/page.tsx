"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ArrowLeft,
  Play,
  Clock,
  Trophy,
  MapPin,
  Calendar,
  Users,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
} from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"
import Link from "next/link"
import { BarChart3 } from "lucide-react" // Import BarChart3

// Mock match data generator
const generateMatchData = (matchId: number) => {
  const matches = [
    {
      id: 1,
      status: "live",
      format: "ODI",
      series: "Border-Gavaskar Trophy",
      venue: "Melbourne Cricket Ground",
      date: "2024-01-15",
      time: "14:30",
      weather: "Sunny, 28°C",
      toss: "India won the toss and elected to bat",
      team1: {
        name: "India",
        flag: "🇮🇳",
        logo: "/placeholder.svg?height=60&width=60",
        score: "287/4",
        overs: "45.3",
        batting: true,
        colors: { primary: "#FF6B35", secondary: "#138808" },
      },
      team2: {
        name: "Australia",
        flag: "🇦🇺",
        logo: "/placeholder.svg?height=60&width=60",
        score: "156/3",
        overs: "28.2",
        batting: false,
        colors: { primary: "#FFD700", secondary: "#008751" },
      },
      currentAction: "SIX! Kohli smashes it over long-on! 🔥",
      target: 288,
      requiredRate: 8.2,
      currentRate: 5.5,
    },
    {
      id: 2,
      status: "completed",
      format: "T20",
      series: "T20 International Series",
      venue: "Lord's Cricket Ground",
      date: "2024-01-14",
      time: "19:00",
      weather: "Cloudy, 22°C",
      toss: "Pakistan won the toss and elected to field",
      team1: {
        name: "England",
        flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        logo: "/placeholder.svg?height=60&width=60",
        score: "156/7",
        overs: "20.0",
        batting: false,
        colors: { primary: "#CE1124", secondary: "#012169" },
      },
      team2: {
        name: "Pakistan",
        flag: "🇵🇰",
        logo: "/placeholder.svg?height=60&width=60",
        score: "142/9",
        overs: "20.0",
        batting: false,
        colors: { primary: "#01411C", secondary: "#FFFFFF" },
      },
      result: "England won by 14 runs",
      playerOfMatch: "Jos Buttler",
    },
    {
      id: 3,
      status: "upcoming",
      format: "Test",
      series: "Test Championship",
      venue: "Newlands Cricket Ground",
      date: "2024-01-16",
      time: "10:00",
      weather: "Partly cloudy, 25°C",
      toss: "TBD",
      team1: {
        name: "South Africa",
        flag: "🇿🇦",
        logo: "/placeholder.svg?height=60&width=60",
        colors: { primary: "#007749", secondary: "#FFB81C" },
      },
      team2: {
        name: "New Zealand",
        flag: "🇳🇿",
        logo: "/placeholder.svg?height=60&width=60",
        colors: { primary: "#000000", secondary: "#FFFFFF" },
      },
      countdown: "2d 10h 30m",
    },
  ]

  return matches.find((m) => m.id === matchId) || matches[0]
}

// Mock data generators
const generateWinProbability = () => [
  { over: 0, team1: 50, team2: 50 },
  { over: 10, team1: 55, team2: 45 },
  { over: 20, team1: 62, team2: 38 },
  { over: 30, team1: 58, team2: 42 },
  { over: 40, team1: 65, team2: 35 },
  { over: 45, team1: 72, team2: 28 },
]

const generateCommentary = () => [
  {
    id: 1,
    over: "45.3",
    ball: 3,
    runs: 6,
    batsman: "V. Kohli",
    bowler: "P. Cummins",
    commentary: "SIX! Kohli smashes it over long-on! What a shot! 🔥",
    timestamp: "14:45",
    type: "boundary",
  },
  {
    id: 2,
    over: "45.2",
    ball: 2,
    runs: 1,
    batsman: "V. Kohli",
    bowler: "P. Cummins",
    commentary: "Single taken to deep square leg 🏏",
    timestamp: "14:44",
    type: "run",
  },
  {
    id: 3,
    over: "45.1",
    ball: 1,
    runs: 0,
    batsman: "K.L. Rahul",
    bowler: "P. Cummins",
    commentary: "Dot ball, good length delivery outside off",
    timestamp: "14:43",
    type: "dot",
  },
  {
    id: 4,
    over: "44.6",
    ball: 6,
    runs: 0,
    batsman: "K.L. Rahul",
    bowler: "M. Starc",
    commentary: "WICKET! Rahul c Smith b Starc! What a catch! ❌",
    timestamp: "14:42",
    type: "wicket",
  },
]

const generateScorecard = () => ({
  batting: [
    { name: "R. Sharma", runs: 45, balls: 52, fours: 6, sixes: 1, sr: 86.5, status: "c Smith b Cummins" },
    { name: "S. Dhawan", runs: 32, balls: 41, fours: 4, sixes: 0, sr: 78.0, status: "lbw b Starc" },
    { name: "V. Kohli", runs: 89, balls: 67, fours: 8, sixes: 3, sr: 132.8, status: "not out" },
    { name: "K.L. Rahul", runs: 67, balls: 58, fours: 7, sixes: 2, sr: 115.5, status: "c Smith b Starc" },
    { name: "H. Pandya", runs: 23, balls: 18, fours: 2, sixes: 1, sr: 127.8, status: "not out" },
  ],
  bowling: [
    { name: "M. Starc", overs: 9.3, maidens: 1, runs: 52, wickets: 2, economy: 5.5, wd: 2, nb: 1 },
    { name: "P. Cummins", overs: 10, maidens: 2, runs: 48, wickets: 1, economy: 4.8, wd: 1, nb: 0 },
    { name: "J. Hazlewood", overs: 8, maidens: 1, runs: 41, wickets: 0, economy: 5.1, wd: 0, nb: 0 },
    { name: "A. Zampa", overs: 10, maidens: 0, runs: 67, wickets: 1, economy: 6.7, wd: 3, nb: 0 },
    { name: "G. Maxwell", overs: 8, maidens: 0, runs: 45, wickets: 0, economy: 5.6, wd: 1, nb: 0 },
  ],
  partnerships: [
    { wicket: 1, runs: 78, balls: 89, batsmen: "Sharma & Dhawan" },
    { wicket: 2, runs: 45, balls: 52, batsmen: "Dhawan & Kohli" },
    { wicket: 3, runs: 89, balls: 67, batsmen: "Kohli & Rahul" },
    { wicket: 4, runs: 52, balls: 34, batsmen: "Rahul & Pandya" },
  ],
  fallOfWickets: [
    { wicket: 1, runs: 78, over: "12.4", batsman: "R. Sharma" },
    { wicket: 2, runs: 123, over: "21.2", batsman: "S. Dhawan" },
    { wicket: 3, runs: 212, over: "35.1", batsman: "K.L. Rahul" },
    { wicket: 4, runs: 264, over: "42.3", batsman: "S. Iyer" },
  ],
})

const generatePlayingXI = () => ({
  team1: [
    "R. Sharma (c)",
    "S. Dhawan",
    "V. Kohli",
    "K.L. Rahul (wk)",
    "H. Pandya",
    "R. Jadeja",
    "W. Sundar",
    "B. Kumar",
    "J. Bumrah",
    "Y. Chahal",
    "M. Shami",
  ],
  team2: [
    "D. Warner",
    "A. Finch (c)",
    "S. Smith",
    "M. Labuschagne",
    "G. Maxwell",
    "A. Carey (wk)",
    "M. Stoinis",
    "P. Cummins",
    "M. Starc",
    "J. Hazlewood",
    "A. Zampa",
  ],
})

function MatchHeader({ match }: { match: any }) {
  const getStatusTheme = (status: string) => {
    switch (status) {
      case "live":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/50",
          text: "text-red-400",
          pulse: "animate-pulse",
        }
      case "completed":
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-400",
          pulse: "",
        }
      case "upcoming":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          text: "text-blue-400",
          pulse: "",
        }
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/50",
          text: "text-gray-400",
          pulse: "",
        }
    }
  }

  const theme = getStatusTheme(match.status)

  return (
    <Card className={`${theme.bg} backdrop-blur-lg ${theme.border} border-2 ${theme.pulse}`}>
      <CardContent className="p-6">
        {/* Match Status and Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Badge className={`${theme.bg} ${theme.text} border-0 px-3 py-1 font-semibold`}>
              {match.status === "live" && <Play className="w-3 h-3 mr-1" />}
              {match.status === "completed" && <Trophy className="w-3 h-3 mr-1" />}
              {match.status === "upcoming" && <Clock className="w-3 h-3 mr-1" />}
              {match.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/80">
              {match.format}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-white/80 font-medium">{match.series}</div>
            <div className="text-white/60 text-sm">{match.venue}</div>
          </div>
        </div>

        {/* Teams and Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Team 1 */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Avatar
                className={`h-16 w-16 ring-4 ${match.team1.batting ? "ring-green-400 animate-pulse-glow" : "ring-white/30"}`}
              >
                <AvatarImage src={match.team1.logo || "/placeholder.svg"} alt={match.team1.name} />
                <AvatarFallback className="text-2xl">{match.team1.flag}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {match.team1.name}
                  {match.team1.batting && <Zap className="w-5 h-5 text-green-400 animate-pulse" />}
                </h2>
                {(match.team1.score || match.status === "upcoming") && (
                  <div className="text-3xl font-bold text-white/90">
                    {match.team1.score || "vs"}
                    {match.team1.overs && <span className="text-lg text-white/60 ml-2">({match.team1.overs})</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center Action/Commentary */}
          <div className="text-center">
            {match.status === "live" && match.currentAction && (
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="text-green-400 font-semibold text-sm mb-1">LIVE ACTION</div>
                <div className="text-white font-medium">{match.currentAction}</div>
              </div>
            )}
            {match.status === "completed" && match.result && (
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="text-yellow-400 font-semibold text-sm mb-1">RESULT</div>
                <div className="text-white font-medium">{match.result}</div>
              </div>
            )}
            {match.status === "upcoming" && match.countdown && (
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="text-blue-400 font-semibold text-sm mb-1">STARTS IN</div>
                <div className="text-white font-medium text-xl">{match.countdown}</div>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="text-center lg:text-right">
            <div className="flex flex-col sm:flex-row-reverse items-center gap-4">
              <Avatar
                className={`h-16 w-16 ring-4 ${match.team2.batting ? "ring-green-400 animate-pulse-glow" : "ring-white/30"}`}
              >
                <AvatarImage src={match.team2.logo || "/placeholder.svg"} alt={match.team2.name} />
                <AvatarFallback className="text-2xl">{match.team2.flag}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-right">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 justify-center sm:justify-end">
                  {match.team2.batting && <Zap className="w-5 h-5 text-green-400 animate-pulse" />}
                  {match.team2.name}
                </h2>
                {(match.team2.score || match.status === "upcoming") && (
                  <div className="text-3xl font-bold text-white/90">
                    {match.team2.score || ""}
                    {match.team2.overs && <span className="text-lg text-white/60 ml-2">({match.team2.overs})</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live Match Stats */}
        {match.status === "live" && match.target && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-white/60 text-sm">Target</div>
              <div className="text-white font-bold text-lg">{match.target}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Required Rate</div>
              <div className="text-white font-bold text-lg">{match.requiredRate}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Current Rate</div>
              <div className="text-white font-bold text-lg">{match.currentRate}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Needed</div>
              <div className="text-white font-bold text-lg">
                {match.target - Number.parseInt(match.team2.score.split("/")[0])}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MatchInfoSection({ match, playingXI }: { match: any; playingXI: any }) {
  const [showPlayingXI, setShowPlayingXI] = useState(false)

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          Match Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <span className="text-white/80">
                {match.date} at {match.time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{match.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{match.weather}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{match.series}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-white/60" />
              <span className="text-white/80">Toss: {match.toss}</span>
            </div>
            {match.playerOfMatch && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white/60" />
                <span className="text-white/80">Player of the Match: {match.playerOfMatch}</span>
              </div>
            )}
          </div>
        </div>

        {/* Playing XI */}
        <Collapsible open={showPlayingXI} onOpenChange={setShowPlayingXI}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-white/90 hover:bg-white/10">
              <span>Playing XI</span>
              {showPlayingXI ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">{match.team1.name}</h4>
                <div className="space-y-1">
                  {playingXI.team1.map((player: string, index: number) => (
                    <div key={index} className="text-white/80 text-sm">
                      {index + 1}. {player}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">{match.team2.name}</h4>
                <div className="space-y-1">
                  {playingXI.team2.map((player: string, index: number) => (
                    <div key={index} className="text-white/80 text-sm">
                      {index + 1}. {player}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

function ProbabilitySection({ winProbability }: { winProbability: any[] }) {
  const currentProb = winProbability[winProbability.length - 1]
  const pieData = [
    { name: "Team 1", value: currentProb.team1, fill: "#22c55e" },
    { name: "Team 2", value: currentProb.team2, fill: "#3b82f6" },
  ]

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Win Probability & Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Win Probability Chart */}
          <div>
            <h4 className="text-white font-medium mb-4">Win Probability Over Time</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={winProbability}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="over" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", color: "#fff" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Line type="monotone" dataKey="team1" stroke="#22c55e" strokeWidth={3} />
                <Line type="monotone" dataKey="team2" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Current Odds */}
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-4">Current Win Probability</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* AI Insight */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-blue-400 font-semibold text-sm mb-2">🤖 AI INSIGHT</div>
              <div className="text-white/80 text-sm">
                Chasing team has 65% win rate from this stage. Current required rate is manageable with 7 wickets in
                hand. Key partnership building phase.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CommentarySection({ commentary }: { commentary: any[] }) {
  const getCommentaryIcon = (type: string) => {
    switch (type) {
      case "boundary":
        return "🔥"
      case "wicket":
        return "❌"
      case "run":
        return "🏏"
      default:
        return "⚪"
    }
  }

  const getCommentaryColor = (type: string) => {
    switch (type) {
      case "boundary":
        return "border-l-green-500"
      case "wicket":
        return "border-l-red-500"
      case "run":
        return "border-l-blue-500"
      default:
        return "border-l-gray-500"
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-orange-400" />
          Live Commentary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {commentary.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg bg-white/5 border-l-4 ${getCommentaryColor(comment.type)} hover:bg-white/10 transition-colors`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCommentaryIcon(comment.type)}</span>
                  <span className="font-mono text-white/80 text-sm">{comment.over}</span>
                  <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                    {comment.runs} run{comment.runs !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <span className="text-white/60 text-xs">{comment.timestamp}</span>
              </div>
              <div className="text-white/90 text-sm mb-1">{comment.commentary}</div>
              <div className="text-white/60 text-xs">
                {comment.batsman} • {comment.bowler}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ScorecardSection({ scorecard, match }: { scorecard: any; match: any }) {
  const [showPartnerships, setShowPartnerships] = useState(false)
  const [showFallOfWickets, setShowFallOfWickets] = useState(false)

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="batting" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/20">
            <TabsTrigger
              value="batting"
              className="text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Batting
            </TabsTrigger>
            <TabsTrigger
              value="bowling"
              className="text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Bowling
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batting" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 hover:bg-white/10">
                    <TableHead className="text-white/80">Batsman</TableHead>
                    <TableHead className="text-white/80">Runs</TableHead>
                    <TableHead className="text-white/80">Balls</TableHead>
                    <TableHead className="text-white/80">4s</TableHead>
                    <TableHead className="text-white/80">6s</TableHead>
                    <TableHead className="text-white/80">SR</TableHead>
                    <TableHead className="text-white/80">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scorecard.batting.map((batsman: any, index: number) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{batsman.name}</TableCell>
                      <TableCell className="text-white/80">{batsman.runs}</TableCell>
                      <TableCell className="text-white/80">{batsman.balls}</TableCell>
                      <TableCell className="text-white/80">{batsman.fours}</TableCell>
                      <TableCell className="text-white/80">{batsman.sixes}</TableCell>
                      <TableCell className="text-white/80">{batsman.sr}</TableCell>
                      <TableCell className="text-white/60 text-sm">{batsman.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Partnerships */}
            <Collapsible open={showPartnerships} onOpenChange={setShowPartnerships} className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white/90 hover:bg-white/10">
                  <span>Partnerships</span>
                  {showPartnerships ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="space-y-2">
                  {scorecard.partnerships.map((partnership: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white/80 text-sm">{partnership.batsmen}</span>
                      <span className="text-white font-medium">
                        {partnership.runs} runs ({partnership.balls} balls)
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Fall of Wickets */}
            <Collapsible open={showFallOfWickets} onOpenChange={setShowFallOfWickets} className="mt-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white/90 hover:bg-white/10">
                  <span>Fall of Wickets</span>
                  {showFallOfWickets ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {scorecard.fallOfWickets.map((wicket: any, index: number) => (
                    <div key={index} className="text-center p-2 bg-white/5 rounded">
                      <div className="text-white font-medium">
                        {wicket.runs}/{wicket.wicket}
                      </div>
                      <div className="text-white/60 text-xs">{wicket.over}</div>
                      <div className="text-white/60 text-xs">{wicket.batsman}</div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TabsContent>

          <TabsContent value="bowling" className="mt-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 hover:bg-white/10">
                    <TableHead className="text-white/80">Bowler</TableHead>
                    <TableHead className="text-white/80">Overs</TableHead>
                    <TableHead className="text-white/80">Maidens</TableHead>
                    <TableHead className="text-white/80">Runs</TableHead>
                    <TableHead className="text-white/80">Wickets</TableHead>
                    <TableHead className="text-white/80">Economy</TableHead>
                    <TableHead className="text-white/80">Extras</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scorecard.bowling.map((bowler: any, index: number) => (
                    <TableRow key={index} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{bowler.name}</TableCell>
                      <TableCell className="text-white/80">{bowler.overs}</TableCell>
                      <TableCell className="text-white/80">{bowler.maidens}</TableCell>
                      <TableCell className="text-white/80">{bowler.runs}</TableCell>
                      <TableCell className="text-white/80">{bowler.wickets}</TableCell>
                      <TableCell className="text-white/80">{bowler.economy}</TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {bowler.wd}wd, {bowler.nb}nb
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function SingleMatchPage() {
  const params = useParams()
  const matchId = Number.parseInt(params.id as string)
  const [match, setMatch] = useState<any>(null)
  const [winProbability, setWinProbability] = useState<any[]>([])
  const [commentary, setCommentary] = useState<any[]>([])
  const [scorecard, setScorecard] = useState<any>(null)
  const [playingXI, setPlayingXI] = useState<any>(null)

  useEffect(() => {
    // Simulate data loading
    setMatch(generateMatchData(matchId))
    setWinProbability(generateWinProbability())
    setCommentary(generateCommentary())
    setScorecard(generateScorecard())
    setPlayingXI(generatePlayingXI())
  }, [matchId])

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading match details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/matches">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 p-2 hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Trophy className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Match Details
                </h1>
                <p className="text-xs text-white/60">Live cricket insights</p>
              </div>
            </div>
            <NavigationMenu currentPage="matches" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
        {/* Match Header */}
        <MatchHeader match={match} />

        {/* Content Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Match Info */}
            <MatchInfoSection match={match} playingXI={playingXI} />

            {/* Probability & Odds (only for live/completed matches) */}
            {(match.status === "live" || match.status === "completed") && (
              <ProbabilitySection winProbability={winProbability} />
            )}

            {/* Scorecard (only for live/completed matches) */}
            {(match.status === "live" || match.status === "completed") && (
              <ScorecardSection scorecard={scorecard} match={match} />
            )}
          </div>

          {/* Right Column - Commentary (only for live matches) */}
          {match.status === "live" && (
            <div className="xl:col-span-1">
              <CommentarySection commentary={commentary} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
