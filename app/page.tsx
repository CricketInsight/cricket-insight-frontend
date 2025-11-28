"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { TrendingUp, Users, Trophy, BarChart3, ArrowRight, Star, Target } from "lucide-react"
import Link from "next/link"
import { matchesApi, Match } from "@/lib/api/matches"
import { playersApi, Player } from "@/lib/api/players"

// Extended interfaces with unique keys
interface MatchWithKey extends Match {
  _uniqueKey: string
}

interface PlayerWithKey extends Player {
  _uniqueKey: string
}





// Animated Counter Component
function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function HomePage() {
  const [recentMatches, setRecentMatches] = useState<MatchWithKey[]>([])
  const [topPlayers, setTopPlayers] = useState<PlayerWithKey[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchesData, playersData] = await Promise.all([
          matchesApi.getMatches({ page: 1, limit: 4 }),
          playersApi.getPlayers({ page: 1, limit: 4 })
        ])
        
        // Show all matches (not just completed ones)
        const recentMatchesData = (matchesData.data || [])
          .sort((a, b) => {
            const timeA = a.match_start_ts ? new Date(a.match_start_ts).getTime() : 0
            const timeB = b.match_start_ts ? new Date(b.match_start_ts).getTime() : 0
            return timeB - timeA // Most recent first
          })
          .slice(0, 3)
          .map((match, index) => ({ ...match, _uniqueKey: `match-${match.match_id || index}-${index}` } as MatchWithKey))
        
        const uniquePlayers = (playersData.data || [])
          .slice(0, 4)
          .map((player, index) => ({ ...player, _uniqueKey: `player-${player.player_id || index}-${index}` } as PlayerWithKey))
        
        setRecentMatches(recentMatchesData)
        setTopPlayers(uniquePlayers)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
    setIsLoaded(true)
  }, [])

  const stats = [
    {
      title: "Active Players",
      value: "2,847",
      change: "+12%",
      icon: Users,
      description: "Professional cricketers tracked",
    },
    {
      title: "Matches Analyzed",
      value: "15,432",
      change: "+8%",
      icon: Trophy,
      description: "International and domestic matches",
    },
    {
      title: "Data Points",
      value: "2.4M",
      change: "+23%",
      icon: BarChart3,
      description: "Statistical insights generated",
    },
    {
      title: "Predictions",
      value: "89.2%",
      change: "+2.1%",
      icon: Target,
      description: "Average accuracy rate",
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Cricket Insights",
            "description": "Advanced cricket analysis platform with real-time scores, player statistics, team analytics, match predictions, and comprehensive cricket insights.",
            "url": "https://cricketinsights.com",
            "applicationCategory": "SportsApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1247"
            }
          })
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-slate-50 light:via-blue-50 light:to-slate-50">
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 dark:from-slate-900/90 dark:via-purple-900/90 dark:to-slate-900/90 light:from-slate-800/95 light:via-blue-900/95 light:to-slate-800/95 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-lg">CI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cricket Insights</h1>
                <p className="text-sm text-gray-300">Advanced Analytics Platform</p>
              </div>
            </div>
            <NavigationMenu currentPage="home" />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Cricket Analytics
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Reimagined
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Dive deep into cricket statistics, player performances, and match insights with our advanced analytics
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/player/compare">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                >
                  Explore Players
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/insights">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  View Insights
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card
                  key={stat.title}
                  className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-white transition-all duration-300 flex-shrink-0"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8 text-green-400 flex-shrink-0" />
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-300 dark:bg-green-500/20 dark:text-green-300 light:bg-green-100 light:text-green-800"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-white dark:text-white light:text-slate-900 truncate">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium text-gray-300 dark:text-gray-300 light:text-slate-700 truncate">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-400 light:text-slate-600 line-clamp-2">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recent Matches */}
          <Card className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm mt-16">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Matches
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-300 light:text-slate-600">
                Latest cricket match updates and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                {loading ? (
                  <div className="text-white/80 text-center py-4">Loading matches...</div>
                ) : recentMatches.length > 0 ? (
                  recentMatches.map((match) => (
                    <Link key={match._uniqueKey} href={`/matches/${match.match_id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              match.status === "live"
                                ? "destructive"
                                : match.status === "completed"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {match.status}
                          </Badge>
                          <div>
                            <p className="font-medium text-white dark:text-white light:text-slate-900">
                              {match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}
                            </p>
                            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">{match.format}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {match.status === "live" && (
                            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-700 font-mono">
                              {match.team1?.score} vs {match.team2?.score}
                            </p>
                          )}
                          {match.status === "completed" && match.result && (
                            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-700">
                              {match.result}
                            </p>
                          )}
                          {match.status === "upcoming" && (
                            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-700">
                              {match.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-white/80 text-center py-4">No matches available</div>
                )}
              </div>
              <div className="mt-6">
                <Link href="/matches">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white dark:border-white/20 dark:text-white light:border-slate-300 light:text-slate-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 bg-transparent"
                  >
                    View All Matches
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performers
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-300 light:text-slate-600">
                Leading players based on recent performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                {loading ? (
                  <div className="text-white/80 text-center py-4">Loading players...</div>
                ) : topPlayers.length > 0 ? (
                  topPlayers.map((player, index) => {
                    const battingAvg = player.career_averages?.find(avg => avg.format === 'ODI')?.batting_average || 0
                    return (
                      <Link key={player._uniqueKey} href={`/player/${player.player_id}`}>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-50 border border-white/10 dark:border-white/10 light:border-slate-200 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-white dark:text-white light:text-slate-900">{player.name}</p>
                              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">{player.country}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-700 font-mono">
                              Avg: {battingAvg.toFixed(1)}
                            </p>
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          </div>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <div className="text-white/80 text-center py-4">No players available</div>
                )}
              </div>
              <div className="mt-6">
                <Link href="/player/compare">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white dark:border-white/20 dark:text-white light:border-slate-300 light:text-slate-900 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 bg-transparent"
                  >
                    Compare Players
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </>
  )
}
