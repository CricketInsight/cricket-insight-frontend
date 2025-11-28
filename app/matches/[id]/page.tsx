"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavigationMenu } from "@/components/navigation-menu"
import { matchesApi, Match, Inning } from "@/lib/api/matches"
import CricketBallPopup from "@/components/cricket-ball-popup"
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
import { Progress } from "@/components/ui/progress"

export default function MatchDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string
  const [match, setMatch] = useState<Match | null>(null)
  const [ballByBall, setBallByBall] = useState<Inning[]>([])
  const [loading, setLoading] = useState(true)
  const [ballByBallLoading, setBallByBallLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [playingXIOpen, setPlayingXIOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedBall, setSelectedBall] = useState<Inning | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  const openPopup = (ball: Inning) => {
    setSelectedBall(ball)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedBall(null)
  }

  const fetchBallByBall = async () => {
    try {
      setBallByBallLoading(true)
      const ballData = await matchesApi.getBallByBall(matchId)
      setBallByBall(ballData)
    } catch (err) {
      console.error("Failed to fetch ball-by-ball data:", err)
    } finally {
      setBallByBallLoading(false)
    }
  }

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true)
        const matchData = await matchesApi.getMatch(matchId)
        setMatch(matchData)
        setError(null)
        
        // Fetch ball-by-ball data
        await fetchBallByBall()
      } catch (err) {
        console.error("Failed to fetch match:", err)
        setError("Failed to load match data")
      } finally {
        setLoading(false)
      }
    }

    if (matchId) {
      fetchMatch()
    }
  }, [matchId])

  // Set up WebSocket connections for live matches
  useEffect(() => {
    if (match?.status === "live" && matchId) {
      let ballByBallWs: WebSocket | null = null
      let liveMatchWs: WebSocket | null = null
      
      try {
        // WebSocket for ball-by-ball updates
        ballByBallWs = new WebSocket(`ws://localhost:8000/ws/ball-by-ball/${matchId}`)
        
        // WebSocket for live match updates
        liveMatchWs = new WebSocket('ws://localhost:8000/ws/live-matches')
        
        ballByBallWs.onopen = () => {
          setWsConnected(true)
        }
        
        ballByBallWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'ball_by_ball' && data.match_id === matchId && data.data) {
              setBallByBall(data.data)
            }
          } catch (error) {
            console.warn('Failed to parse ball-by-ball WebSocket message:', error)
          }
        }
        
        liveMatchWs.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (data.type === 'live_matches' && data.data && data.data[matchId]) {
              // Update match data with live updates
              setMatch(prevMatch => {
                if (!prevMatch) return prevMatch
                return {
                  ...prevMatch,
                  ...data.data[matchId]
                }
              })
            }
          } catch (error) {
            console.warn('Failed to parse live match WebSocket message:', error)
          }
        }
        
        ballByBallWs.onerror = () => {
          setWsConnected(false)
        }
        
        liveMatchWs.onerror = () => {
          // Silently handle error
        }
        
        ballByBallWs.onclose = () => {
          setWsConnected(false)
        }
        
        liveMatchWs.onclose = () => {
          // Silently handle close
        }
      } catch (error) {
        // WebSocket creation failed - server not available
        setWsConnected(false)
      }
      
      // Cleanup WebSockets on unmount or when match is no longer live
      return () => {
        if (ballByBallWs && ballByBallWs.readyState === WebSocket.OPEN) {
          ballByBallWs.close()
        }
        if (liveMatchWs && liveMatchWs.readyState === WebSocket.OPEN) {
          liveMatchWs.close()
        }
        setWsConnected(false)
      }
    }
  }, [match?.status, matchId])

  useEffect(() => {
    if (match?.status === "upcoming" && match.match_start_time) {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const distance = new Date(match.match_start_time).getTime() - now

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6">
              <div className="w-full h-40 bg-white/20 rounded-lg animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Match Not Found</h1>
          <p className="text-white/80 mb-4">{error || "The requested match could not be found."}</p>
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
      case "live": return "bg-red-500 animate-pulse"
      case "completed": return "bg-gray-500"
      case "upcoming": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/matches")} className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(match.status)}`} />
                  <span className="text-white font-medium capitalize">{match.status}</span>
                </div>
                {match.status === "live" && (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-xs text-white/80">
                      {wsConnected ? 'Live Updates' : 'Disconnected'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <NavigationMenu currentPage="matches" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
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
              {match.status === "upcoming" && timeLeft && (
                <div className="flex items-center gap-2 text-white">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono">{timeLeft}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className={`text-center p-4 rounded-lg ${match.team1?.batting ? "bg-green-500/20 ring-2 ring-green-500/50" : "bg-white/5"}`}>
                <div className="text-4xl mb-2">{match.team1?.flag || '🏏'}</div>
                <h3 className="text-white font-bold text-lg mb-2">{match.team1?.name || 'Team 1'}</h3>
                {match.status !== "upcoming" && match.team1?.score && (
                  <div className="text-white">
                    <div className="text-2xl font-bold">{match.team1.score}</div>
                    <div className="text-sm text-white/80">({match.team1.overs} overs)</div>
                  </div>
                )}
                {match.team1?.batting && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Batting</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                {match.status === "live" && (
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-white/20">
                    <div className="text-white font-medium text-sm mb-1">Live</div>
                    <div className="text-white text-lg">
                      {match.current_action || 'Match in progress'}
                    </div>
                  </div>
                )}
                {match.status === "completed" && (
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <div className="text-white font-bold text-lg mb-2">
                      {match.result || 'Match Completed'}
                    </div>
                    {match.player_of_match && (
                      <div className="text-white/80 text-sm">
                        Player of the Match: {match.player_of_match}
                      </div>
                    )}
                  </div>
                )}
                {match.status === "upcoming" && (
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-white font-medium mb-2">Starting in</div>
                    <div className="text-white text-xl font-mono">{timeLeft || 'TBD'}</div>
                  </div>
                )}
              </div>

              <div className={`text-center p-4 rounded-lg ${match.team2?.batting ? "bg-green-500/20 ring-2 ring-green-500/50" : "bg-white/5"}`}>
                <div className="text-4xl mb-2">{match.team2?.flag || '🏏'}</div>
                <h3 className="text-white font-bold text-lg mb-2">{match.team2?.name || 'Team 2'}</h3>
                {match.status !== "upcoming" && match.team2?.score && (
                  <div className="text-white">
                    <div className="text-2xl font-bold">{match.team2.score}</div>
                    <div className="text-sm text-white/80">({match.team2.overs} overs)</div>
                  </div>
                )}
                {match.team2?.batting && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Batting</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="info" className="text-white data-[state=active]:bg-white/20">
              Match Info
            </TabsTrigger>
            <TabsTrigger value="probability" className="text-white data-[state=active]:bg-white/20">
              Probability
            </TabsTrigger>
            <TabsTrigger value="scorecard" className="text-white data-[state=active]:bg-white/20">
              Scorecard
            </TabsTrigger>
            <TabsTrigger value="commentary" className="text-white data-[state=active]:bg-white/20">
              Ball-by-Ball
            </TabsTrigger>
          </TabsList>

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
                    <span className="text-white/80">Date:</span>
                    <span className="text-white">{match.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Time:</span>
                    <span className="text-white">{match.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Toss:</span>
                    <span className="text-white">{match.toss || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Weather:</span>
                    <span className="text-white">{match.weather || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Series:</span>
                    <span className="text-white">{match.series}</span>
                  </div>
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
                        <h4 className="text-white font-medium mb-2">{match.team1?.name || 'Team 1'}</h4>
                        <div className="text-white/80 text-sm">
                          {match.squad_info?.find(s => s.team_name === match.team1?.name)?.players?.map((player, i) => (
                            <div key={i}>{i + 1}. {player.name}</div>
                          )) || <div>Squad information not available</div>}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-2">{match.team2?.name || 'Team 2'}</h4>
                        <div className="text-white/80 text-sm">
                          {match.squad_info?.find(s => s.team_name === match.team2?.name)?.players?.map((player, i) => (
                            <div key={i}>{i + 1}. {player.name}</div>
                          )) || <div>Squad information not available</div>}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scorecard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Batting - {match.team1?.name || 'Team 1'}</CardTitle>
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
                        {match.scorecard?.batting?.length > 0 ? (
                          match.scorecard.batting.map((player, index) => (
                            <tr key={index} className="border-b border-white/10">
                              <td className="text-white py-2">
                                {player.name}
                                {!player.isOut && <span className="text-green-400 text-xs ml-1">*</span>}
                              </td>
                              <td className="text-right text-white py-2">{player.runs}</td>
                              <td className="text-right text-white/80 py-2">{player.balls}</td>
                              <td className="text-right text-white/80 py-2">{player.fours}</td>
                              <td className="text-right text-white/80 py-2">{player.sixes}</td>
                              <td className="text-right text-white/80 py-2">{player.strikeRate?.toFixed(1)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-white/80 text-center py-4">
                              No batting data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Bowling - {match.team2?.name || 'Team 2'}</CardTitle>
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
                        {match.scorecard?.bowling?.length > 0 ? (
                          match.scorecard.bowling.map((player, index) => (
                            <tr key={index} className="border-b border-white/10">
                              <td className="text-white py-2">{player.name}</td>
                              <td className="text-right text-white/80 py-2">{player.overs}</td>
                              <td className="text-right text-white/80 py-2">{player.runs}</td>
                              <td className="text-right text-white py-2">{player.wickets}</td>
                              <td className="text-right text-white/80 py-2">{player.economy?.toFixed(1)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-white/80 text-center py-4">
                              No bowling data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {match.scorecard && (match.scorecard.batting?.length > 0 || match.scorecard.bowling?.length > 0) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Partnerships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {match.scorecard.batting?.slice(0, 3).map((player, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                          <span className="text-white text-sm">{player.name} & Partner</span>
                          <span className="text-white/80 text-sm">{player.runs} runs ({player.balls} balls)</span>
                        </div>
                      )) || <div className="text-white/80 text-sm">No partnership data available</div>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Fall of Wickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {match.scorecard.fallOfWickets?.map((wicket, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                          <span className="text-white text-sm">{wicket.wicket}: {wicket.batsman}</span>
                          <span className="text-white/80 text-sm">{wicket.runs}/{wicket.wicket} ({wicket.over} ov)</span>
                        </div>
                      )) || (
                        match.scorecard.batting?.filter(p => p.isOut).map((player, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                            <span className="text-white text-sm">{index + 1}: {player.name}</span>
                            <span className="text-white/80 text-sm">{player.runs} runs</span>
                          </div>
                        ))
                      ) || <div className="text-white/80 text-sm">No wicket data available</div>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="probability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Win Probability Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {match.scorecardSummary?.innings && match.scorecardSummary.innings.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={match.scorecardSummary.innings.map((inning, index) => ({
                        over: inning.overs || (index + 1) * 10,
                        team1: Math.min(Math.max(inning.runs / (inning.target || 200) * 100, 20), 80),
                        team2: 100 - Math.min(Math.max(inning.runs / (inning.target || 200) * 100, 20), 80)
                      }))}>
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
                          name={match.team1?.name || 'Team 1'}
                        />
                        <Line
                          type="monotone"
                          dataKey="team2"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name={match.team2?.name || 'Team 2'}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-white/80 text-center py-8">No probability data available</div>
                  )}
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
                            {
                              name: match.team1?.name || 'Team 1',
                              value: 50,
                              fill: "#22c55e",
                            },
                            {
                              name: match.team2?.name || 'Team 2',
                              value: 50,
                              fill: "#3b82f6",
                            },
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
                        <span className="text-white/80">{match.team1?.name || 'Team 1'}</span>
                        <span className="text-green-400 font-bold">50%</span>
                      </div>
                      <Progress value={50} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-white/80">{match.team2?.name || 'Team 2'}</span>
                        <span className="text-blue-400 font-bold">50%</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                        rate of {match.current_rate || 'N/A'}, which is above the required rate of{" "}
                        {match.required_rate || 'N/A'}. Historical data shows teams with similar positions have a
                        50% success rate.
                      </p>
                    </div>
                  )}
                  {match.status === "completed" && (
                    <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <p className="text-white">
                        📊 <strong>Match Analysis:</strong> This was a closely contested match. The key turning point was
                        {match.player_of_match ? ` ${match.player_of_match}'s performance` : ' the middle overs'},
                        which shifted the momentum in the winning team's favor.
                      </p>
                    </div>
                  )}
                  {match.status === "upcoming" && (
                    <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                      <p className="text-white">
                        🔮 <strong>Pre-match Analysis:</strong> Both teams are evenly matched based on recent form.
                        The pitch conditions at {match.venue?.split(",")[0]} typically favor balanced contests
                        between bat and ball.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commentary" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Ball-by-Ball Commentary
                  {ballByBallLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {ballByBall.length > 0 ? (
                    ballByBall.slice().reverse().map((ball, index) => {
                      const getCommentaryIcon = (runs: number, dismissal: string) => {
                        if (dismissal && dismissal !== "not out") return "❌"
                        if (runs === 6) return "🚀"
                        if (runs === 4) return "🏏"
                        if (runs > 0) return "⚪"
                        return "⚫"
                      }
                      
                      const getCommentaryBorder = (runs: number, dismissal: string) => {
                        if (dismissal && dismissal !== "not out") return "border-l-red-500"
                        if (runs === 6) return "border-l-purple-500"
                        if (runs === 4) return "border-l-green-500"
                        if (runs > 0) return "border-l-blue-500"
                        return "border-l-gray-500"
                      }
                      
                      return (
                        <div 
                          key={`${ball.over}-${ball.ball}-${index}`} 
                          className={`flex gap-3 p-3 rounded-lg border-l-4 ${getCommentaryBorder(ball.runs_on_ball, ball.dismissal)} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}
                          onClick={() => openPopup(ball)}
                        >
                          <div className="text-2xl">{getCommentaryIcon(ball.runs_on_ball, ball.dismissal)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs border-white/30 text-white">
                                {ball.over}.{ball.ball}
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                                {ball.runs_on_ball} run{ball.runs_on_ball !== 1 ? "s" : ""}
                              </Badge>
                              <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                                {ball.current_batting_team}
                              </Badge>
                            </div>
                            <div className="text-white text-sm mb-1">
                              <span className="font-medium">{ball.batsman_name}</span> to <span className="font-medium">{ball.bowler_name}</span>
                            </div>
                            <div 
                              className="text-white/80 text-sm"
                              dangerouslySetInnerHTML={{
                                __html: ball.commentary || ball.ball_info || `${ball.runs_on_ball} run${ball.runs_on_ball !== 1 ? 's' : ''}`
                              }}
                            />
                            {ball.dismissal && ball.dismissal !== "not out" && (
                              <p className="text-red-400 text-sm mt-1 font-medium">
                                {ball.dismissal}
                              </p>
                            )}
                            {ball.outcome && (
                              <p className="text-yellow-400 text-xs mt-1">
                                {ball.outcome}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-white/80 text-center py-8">
                      {ballByBallLoading ? "Loading ball-by-ball data..." : "No ball-by-ball data available"}
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <CricketBallPopup 
          isOpen={isPopupOpen} 
          onClose={closePopup} 
          ballData={selectedBall} 
        />
      </div>
    </div>
  )
}