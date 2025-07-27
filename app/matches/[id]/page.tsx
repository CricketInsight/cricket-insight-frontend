"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavigationMenu } from "@/components/navigation-menu"
import { ChartSkeleton } from "@/components/skeletons/chart-skeleton"
import { CommentarySkeleton } from "@/components/skeletons/commentary-skeleton"
import { ScorecardSkeleton } from "@/components/skeletons/scorecard-skeleton"
import { InsightSkeleton } from "@/components/skeletons/insight-skeleton"
import { useLoading } from "@/hooks/use-loading"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Trophy,
  Users,
  TrendingUp,
  Zap,
  ChevronDown,
  Target,
  Timer,
  Activity,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts"

// Mock data for different match states
const MATCH_DATA = {
  1: {
    id: 1,
    status: "live",
    team1: { name: "India", logo: "🇮🇳", score: 287, wickets: 4, overs: 45.3, batting: true },
    team2: { name: "Australia", logo: "🇦🇺", score: 0, wickets: 0, overs: 0, batting: false },
    format: "ODI",
    venue: "Wankhede Stadium, Mumbai",
    toss: "India won the toss and chose to bat",
    weather: "Clear, 28°C",
    series: "India vs Australia ODI Series 2024",
    commentary: "SIX! Kohli smashes it over long-on! 🔥",
    target: 350,
    requiredRate: 6.2,
    currentRate: 6.4,
    winProbability: { team1: 65, team2: 35 },
  },
  2: {
    id: 2,
    status: "completed",
    team1: { name: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 245, wickets: 10, overs: 48.2, batting: false },
    team2: { name: "Pakistan", logo: "🇵🇰", score: 246, wickets: 6, overs: 47.1, batting: false },
    format: "ODI",
    venue: "Lord's, London",
    toss: "Pakistan won the toss and chose to bowl",
    weather: "Overcast, 18°C",
    series: "England vs Pakistan ODI Series 2024",
    result: "Pakistan won by 4 wickets",
    playerOfMatch: "Babar Azam (89* off 102 balls)",
    winProbability: { team1: 35, team2: 65 },
  },
  3: {
    id: 3,
    status: "upcoming",
    team1: { name: "South Africa", logo: "🇿🇦", score: 0, wickets: 0, overs: 0, batting: false },
    team2: { name: "New Zealand", logo: "🇳🇿", score: 0, wickets: 0, overs: 0, batting: false },
    format: "T20I",
    venue: "Eden Park, Auckland",
    toss: "Not yet decided",
    weather: "Partly cloudy, 22°C",
    series: "South Africa vs New Zealand T20I Series 2024",
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    winProbability: { team1: 50, team2: 50 },
  },
}

const COMMENTARY_DATA = [
  {
    over: "45.3",
    ball: 2,
    runs: 6,
    commentary: "SIX! Kohli smashes it over long-on! What a shot! 🔥",
    type: "boundary",
  },
  { over: "45.2", ball: 1, runs: 1, commentary: "Single taken to deep mid-wicket", type: "run" },
  { over: "45.1", ball: 0, runs: 4, commentary: "FOUR! Beautiful cover drive by Kohli! 🏏", type: "boundary" },
  { over: "44.6", ball: 5, runs: 0, commentary: "Dot ball, good length delivery", type: "dot" },
  { over: "44.5", ball: 4, runs: 0, commentary: "WICKET! Rahul c Maxwell b Cummins! ❌", type: "wicket" },
  { over: "44.4", ball: 3, runs: 2, commentary: "Two runs taken, good running between wickets", type: "run" },
]

const WIN_PROBABILITY_DATA = [
  { over: 10, team1: 55, team2: 45 },
  { over: 20, team1: 60, team2: 40 },
  { over: 30, team1: 58, team2: 42 },
  { over: 40, team1: 65, team2: 35 },
  { over: 45, team1: 65, team2: 35 },
]

const BATTING_DATA = [
  { player: "V. Kohli", runs: 89, balls: 78, fours: 8, sixes: 2, sr: 114.1, status: "not out" },
  { player: "R. Sharma", runs: 67, balls: 65, fours: 6, sixes: 1, sr: 103.1, status: "out" },
  { player: "KL Rahul", runs: 45, balls: 52, fours: 4, sixes: 0, sr: 86.5, status: "out" },
  { player: "H. Pandya", runs: 23, balls: 18, fours: 2, sixes: 1, sr: 127.8, status: "not out" },
]

const BOWLING_DATA = [
  { player: "P. Cummins", overs: 9, maidens: 1, runs: 45, wickets: 2, economy: 5.0 },
  { player: "M. Starc", overs: 8, maidens: 0, runs: 52, wickets: 1, economy: 6.5 },
  { player: "A. Zampa", overs: 10, maidens: 0, runs: 48, wickets: 1, economy: 4.8 },
  { player: "G. Maxwell", overs: 6, maidens: 0, runs: 38, wickets: 0, economy: 6.3 },
]

// Mock API functions
const fetchMatchData = async (matchId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return MATCH_DATA[matchId as keyof typeof MATCH_DATA]
}

const fetchCommentary = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return COMMENTARY_DATA
}

const fetchScorecard = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return { batting: BATTING_DATA, bowling: BOWLING_DATA }
}

const fetchProbabilityData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return WIN_PROBABILITY_DATA
}

export default function MatchDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = Number.parseInt(params.id as string)
  const [timeLeft, setTimeLeft] = useState("")
  const [playingXIOpen, setPlayingXIOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  // Use loading hooks for different data sections
  const { isLoading: matchLoading, data: match } = useLoading(() => fetchMatchData(matchId), [matchId])
  const { isLoading: commentaryLoading, data: commentary } = useLoading(fetchCommentary, [])
  const { isLoading: scorecardLoading, data: scorecard } = useLoading(fetchScorecard, [])
  const { isLoading: probabilityLoading, data: probabilityData } = useLoading(fetchProbabilityData, [])

  useEffect(() => {
    if (match?.status === "upcoming" && match.startTime) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const distance = match.startTime.getTime() - now

        if (distance > 0) {
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((distance % (1000 * 60)) / 1000)

          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
        } else {
          setTimeLeft("Match Started")
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [match])

  if (matchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20 animate-pulse" />
                  <div className="w-16 h-4 bg-white/20 rounded animate-pulse" />
                </div>
              </div>
              <NavigationMenu currentPage="matches" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
          {/* Match Header Skeleton */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-5 bg-white/20 rounded animate-pulse" />
                  <div className="w-32 h-4 bg-white/20 rounded animate-pulse" />
                </div>
                <div className="w-24 h-6 bg-white/20 rounded animate-pulse" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Team skeletons */}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-white/5">
                    <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-2 animate-pulse" />
                    <div className="w-24 h-6 bg-white/20 rounded mx-auto mb-2 animate-pulse" />
                    <div className="w-20 h-8 bg-white/20 rounded mx-auto mb-1 animate-pulse" />
                    <div className="w-16 h-4 bg-white/20 rounded mx-auto animate-pulse" />
                  </div>
                ))}

                {/* Center panel skeleton */}
                <div className="text-center">
                  <div className="w-full h-20 bg-white/20 rounded-lg animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs skeleton */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/20 rounded animate-pulse" />
            ))}
          </div>

          {/* Content skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
          <Button onClick={() => router.push("/matches")} className="bg-gradient-to-r from-green-500 to-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matches
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 animate-pulse"
      case "completed":
        return "bg-gray-500"
      case "upcoming":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCommentaryIcon = (type: string) => {
    switch (type) {
      case "boundary":
        return "🏏"
      case "wicket":
        return "❌"
      case "run":
        return "🔄"
      default:
        return "⚪"
    }
  }

  const getCommentaryBorder = (type: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/matches")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(match.status)}`} />
                <span className="text-white font-medium capitalize">{match.status}</span>
              </div>
            </div>
            <NavigationMenu currentPage="matches" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Match Header */}
        <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-white/30 text-white">
                  {match.format}
                </Badge>
                <div className="flex items-center gap-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{match.venue}</span>
                </div>
              </div>
              {match.status === "upcoming" && (
                <div className="flex items-center gap-2 text-white">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono">{timeLeft}</span>
                </div>
              )}
            </div>

            {/* Teams and Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Team 1 */}
              <div
                className={`text-center p-4 rounded-lg ${match.team1.batting ? "bg-green-500/20 ring-2 ring-green-500/50" : "bg-white/5"}`}
              >
                <div className="text-4xl mb-2">{match.team1.logo}</div>
                <h3 className="text-white font-bold text-lg mb-2">{match.team1.name}</h3>
                {match.status !== "upcoming" && (
                  <div className="text-white">
                    <div className="text-2xl font-bold">
                      {match.team1.score}/{match.team1.wickets}
                    </div>
                    <div className="text-sm text-white/80">({match.team1.overs} overs)</div>
                  </div>
                )}
                {match.team1.batting && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Batting</span>
                  </div>
                )}
              </div>

              {/* Center Panel - Commentary/Status */}
              <div className="text-center">
                {match.status === "live" && match.commentary && (
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-white/20">
                    <div className="text-white font-medium text-sm mb-1">Latest</div>
                    <div className="text-white text-lg">{match.commentary}</div>
                  </div>
                )}
                {match.status === "completed" && match.result && (
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="text-white font-bold text-lg mb-2">{match.result}</div>
                    {match.playerOfMatch && (
                      <div className="text-white/80 text-sm">Player of the Match: {match.playerOfMatch}</div>
                    )}
                  </div>
                )}
                {match.status === "upcoming" && (
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-white font-medium mb-2">Starting in</div>
                    <div className="text-white text-xl font-mono">{timeLeft}</div>
                  </div>
                )}
              </div>

              {/* Team 2 */}
              <div
                className={`text-center p-4 rounded-lg ${match.team2.batting ? "bg-green-500/20 ring-2 ring-green-500/50" : "bg-white/5"}`}
              >
                <div className="text-4xl mb-2">{match.team2.logo}</div>
                <h3 className="text-white font-bold text-lg mb-2">{match.team2.name}</h3>
                {match.status !== "upcoming" && (
                  <div className="text-white">
                    <div className="text-2xl font-bold">
                      {match.team2.score}/{match.team2.wickets}
                    </div>
                    <div className="text-sm text-white/80">({match.team2.overs} overs)</div>
                  </div>
                )}
                {match.team2.batting && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Batting</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="info" className="text-white data-[state=active]:bg-white/20">
              Match Info
            </TabsTrigger>
            <TabsTrigger value="probability" className="text-white data-[state=active]:bg-white/20">
              Probability
            </TabsTrigger>
            <TabsTrigger value="commentary" className="text-white data-[state=active]:bg-white/20">
              Commentary
            </TabsTrigger>
            <TabsTrigger value="scorecard" className="text-white data-[state=active]:bg-white/20">
              Scorecard
            </TabsTrigger>
          </TabsList>

          {/* Match Info */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Match Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/80">Format:</span>
                    <span className="text-white">{match.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Venue:</span>
                    <span className="text-white">{match.venue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Toss:</span>
                    <span className="text-white">{match.toss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Weather:</span>
                    <span className="text-white">{match.weather}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Series:</span>
                    <span className="text-white">{match.series}</span>
                  </div>
                  {match.status === "live" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/80">Target:</span>
                        <span className="text-white">{match.target}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Required Rate:</span>
                        <span className="text-white">{match.requiredRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Current Rate:</span>
                        <span className="text-white">{match.currentRate}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Playing XI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Collapsible open={playingXIOpen} onOpenChange={setPlayingXIOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                        View Playing XI
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 mt-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">{match.team1.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                          <div>1. R. Sharma (c)</div>
                          <div>2. S. Dhawan</div>
                          <div>3. V. Kohli</div>
                          <div>4. KL Rahul (wk)</div>
                          <div>5. H. Pandya</div>
                          <div>6. R. Jadeja</div>
                          <div>7. W. Sundar</div>
                          <div>8. B. Kumar</div>
                          <div>9. J. Bumrah</div>
                          <div>10. Y. Chahal</div>
                          <div>11. M. Shami</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">{match.team2.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                          <div>1. D. Warner</div>
                          <div>2. A. Finch (c)</div>
                          <div>3. S. Smith</div>
                          <div>4. M. Labuschagne</div>
                          <div>5. G. Maxwell</div>
                          <div>6. A. Carey (wk)</div>
                          <div>7. M. Stoinis</div>
                          <div>8. P. Cummins</div>
                          <div>9. M. Starc</div>
                          <div>10. A. Zampa</div>
                          <div>11. J. Hazlewood</div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Probability & Odds */}
          <TabsContent value="probability" className="space-y-6">
            {probabilityLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartSkeleton title={true} height={300} showLegend={true} />
                <ChartSkeleton title={true} height={200} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Win Probability Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={probabilityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="over" stroke="#ffffff80" />
                        <YAxis stroke="#ffffff80" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="team1"
                          stroke="#22c55e"
                          strokeWidth={2}
                          name={match.team1.name}
                        />
                        <Line
                          type="monotone"
                          dataKey="team2"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name={match.team2.name}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Current Win Probability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: match.team1.name, value: match.winProbability.team1, fill: "#22c55e" },
                              { name: match.team2.name, value: match.winProbability.team2, fill: "#3b82f6" },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0,0,0,0.8)",
                              border: "1px solid rgba(255,255,255,0.2)",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">{match.team1.name}</span>
                          <span className="text-green-400 font-bold">{match.winProbability.team1}%</span>
                        </div>
                        <Progress value={match.winProbability.team1} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-white/80">{match.team2.name}</span>
                          <span className="text-blue-400 font-bold">{match.winProbability.team2}%</span>
                        </div>
                        <Progress value={match.winProbability.team2} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Insights */}
            {probabilityLoading ? (
              <InsightSkeleton />
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {match.status === "live" && (
                      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-white/20">
                        <p className="text-white">
                          🎯 <strong>Key Insight:</strong> The batting team has a slight advantage with a current run
                          rate of {match.currentRate}, which is above the required rate of {match.requiredRate}.
                          Historical data shows teams with similar positions have a {match.winProbability.team1}%
                          success rate.
                        </p>
                      </div>
                    )}
                    {match.status === "completed" && (
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <p className="text-white">
                          📊 <strong>Match Analysis:</strong> This was a closely contested match with the winning margin
                          being just 4 wickets. The key turning point was Babar Azam's unbeaten 89, which shifted the
                          momentum in Pakistan's favor.
                        </p>
                      </div>
                    )}
                    {match.status === "upcoming" && (
                      <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                        <p className="text-white">
                          🔮 <strong>Pre-match Analysis:</strong> Both teams are evenly matched based on recent form.
                          The pitch conditions at {match.venue.split(",")[0]} typically favor balanced contests between
                          bat and ball.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Live Commentary */}
          <TabsContent value="commentary" className="space-y-6">
            {commentaryLoading ? (
              <CommentarySkeleton />
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Ball-by-Ball Commentary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {commentary?.map((comment: any, index: number) => (
                      <div
                        key={index}
                        className={`flex gap-3 p-3 rounded-lg border-l-4 ${getCommentaryBorder(comment.type)} bg-white/5`}
                      >
                        <div className="text-2xl">{getCommentaryIcon(comment.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs border-white/30 text-white">
                              {comment.over}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                              {comment.runs} run{comment.runs !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <p className="text-white text-sm">{comment.commentary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Scorecard */}
          <TabsContent value="scorecard" className="space-y-6">
            {scorecardLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScorecardSkeleton />
                <ScorecardSkeleton />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Batting */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Batting - {match.team1.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left text-white/80 py-2">Player</th>
                            <th className="text-right text-white/80 py-2">Runs</th>
                            <th className="text-right text-white/80 py-2">Balls</th>
                            <th className="text-right text-white/80 py-2">4s</th>
                            <th className="text-right text-white/80 py-2">6s</th>
                            <th className="text-right text-white/80 py-2">SR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scorecard?.batting.map((player: any, index: number) => (
                            <tr key={index} className="border-b border-white/10">
                              <td className="text-white py-2">
                                {player.player}
                                {player.status === "not out" && <span className="text-green-400 text-xs ml-1">*</span>}
                              </td>
                              <td className="text-right text-white py-2">{player.runs}</td>
                              <td className="text-right text-white/80 py-2">{player.balls}</td>
                              <td className="text-right text-white/80 py-2">{player.fours}</td>
                              <td className="text-right text-white/80 py-2">{player.sixes}</td>
                              <td className="text-right text-white/80 py-2">{player.sr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Bowling */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Bowling - {match.team2.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="text-left text-white/80 py-2">Player</th>
                            <th className="text-right text-white/80 py-2">Overs</th>
                            <th className="text-right text-white/80 py-2">Runs</th>
                            <th className="text-right text-white/80 py-2">Wkts</th>
                            <th className="text-right text-white/80 py-2">Econ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scorecard?.bowling.map((player: any, index: number) => (
                            <tr key={index} className="border-b border-white/10">
                              <td className="text-white py-2">{player.player}</td>
                              <td className="text-right text-white/80 py-2">{player.overs}</td>
                              <td className="text-right text-white/80 py-2">{player.runs}</td>
                              <td className="text-right text-white py-2">{player.wickets}</td>
                              <td className="text-right text-white/80 py-2">{player.economy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Partnership & Fall of Wickets */}
            {!scorecardLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Partnerships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">Kohli & Pandya</span>
                        <span className="text-white/80 text-sm">67 runs (45 balls)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">Sharma & Kohli</span>
                        <span className="text-white/80 text-sm">89 runs (78 balls)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">Rahul & Sharma</span>
                        <span className="text-white/80 text-sm">56 runs (52 balls)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Fall of Wickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">1st: Dhawan (23)</span>
                        <span className="text-white/80 text-sm">45/1 (8.2 ov)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">2nd: Sharma (67)</span>
                        <span className="text-white/80 text-sm">134/2 (22.4 ov)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">3rd: Rahul (45)</span>
                        <span className="text-white/80 text-sm">190/3 (32.1 ov)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">4th: Sundar (12)</span>
                        <span className="text-white/80 text-sm">245/4 (41.3 ov)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
