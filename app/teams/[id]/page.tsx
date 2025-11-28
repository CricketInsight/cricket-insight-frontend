"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavigationMenu } from "@/components/navigation-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Trophy, TrendingUp, Calendar, MapPin, Award, BarChart3, Star } from "lucide-react"

import { useState, useEffect } from "react"
import { teamsApi } from "@/lib/api/teams"

interface TeamStats {
  matches: number
  wins: number
  losses: number
  draws?: number
  winPercentage: number
  ranking: number
}

interface Player {
  name: string
  role: string
  average: number
  wickets?: number
}

interface Team {
  id: number
  name: string
  captain: string
  coach: string
  founded: number
  homeGround: string
  stats: {
    test: TeamStats
    odi: TeamStats
    t20: TeamStats
  }
  recentForm: number
  keyPlayers: Player[]
  achievements: string[]
}

const mockTeam: Team = {
  id: 1,
  name: "India",
  captain: "Rohit Sharma",
  coach: "Rahul Dravid",
  founded: 1932,
  homeGround: "Various",
  stats: {
    test: {
      matches: 576,
      wins: 176,
      losses: 178,
      draws: 222,
      winPercentage: 30.6,
      ranking: 1,
    },
    odi: {
      matches: 1027,
      wins: 540,
      losses: 431,
      winPercentage: 52.6,
      ranking: 1,
    },
    t20: {
      matches: 199,
      wins: 130,
      losses: 63,
      winPercentage: 65.3,
      ranking: 1,
    },
  },
  recentForm: 78,
  keyPlayers: [
    { name: "Virat Kohli", role: "Batsman", average: 52.4 },
    { name: "Rohit Sharma", role: "Batsman", average: 48.9 },
    { name: "Jasprit Bumrah", role: "Bowler", average: 22.8, wickets: 128 },
    { name: "Ravindra Jadeja", role: "All-rounder", average: 35.2, wickets: 289 },
  ],
  achievements: [
    "ICC Cricket World Cup 2011",
    "ICC Champions Trophy 2013",
    "ICC T20 World Cup 2007",
    "Asia Cup Winners (7 times)",
  ],
}

export default function TeamPage({ params }: { params: { id: string } }) {
  const [teamData, setTeamData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true)
        // Just use mock data for now to avoid params error
        setTeamData(mockTeam)
      } catch (error) {
        console.error("Failed to fetch team data:", error)
        setTeamData(mockTeam)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  const team = teamData || mockTeam
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading team data...</div>
      </div>
    )
  }

  const getFormColor = (form: number) => {
    if (form >= 80) return "text-green-400"
    if (form >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 light:from-slate-50 light:via-blue-50 light:to-slate-50">
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 dark:from-slate-900/90 dark:via-purple-900/90 dark:to-slate-900/90 light:from-slate-800/95 light:via-blue-900/95 light:to-slate-800/95 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Team Profile</h1>
                <p className="text-sm text-gray-300">Comprehensive team statistics and analysis</p>
              </div>
            </div>
            <NavigationMenu />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Team Header */}
          <Card className="bg-white/10 dark:bg-white/10 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white dark:text-white light:text-slate-900">{team.name}</h1>
                    <p className="text-lg text-gray-300 dark:text-gray-300 light:text-slate-600">
                      National Cricket Team
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-slate-600">
                      <Star className="h-4 w-4" />
                      Captain: {team.captain}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-slate-600">
                      <Users className="h-4 w-4" />
                      Coach: {team.coach}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-slate-600">
                      <Calendar className="h-4 w-4" />
                      Founded: {team.founded}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-slate-600">
                      <MapPin className="h-4 w-4" />
                      Home: {team.homeGround}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-green-600 text-white">Test Rank: #{team.stats.test.ranking}</Badge>
                    <Badge className="bg-blue-600 text-white">ODI Rank: #{team.stats.odi.ranking}</Badge>
                    <Badge className="bg-purple-600 text-white">T20 Rank: #{team.stats.t20.ranking}</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2">
                    <span className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Recent Form</span>
                  </div>
                  <div className={`text-3xl font-bold ${getFormColor(team.recentForm)}`}>{team.recentForm}%</div>
                  <Progress value={team.recentForm} className="w-20 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Tabs */}
          <Card className="bg-white/10 dark:bg-white/10 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Team Statistics
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-300 light:text-slate-600">
                Performance data across all international formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="test" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-white/10 dark:bg-white/10 light:bg-slate-100">
                  <TabsTrigger
                    value="test"
                    className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-white/20 light:data-[state=active]:bg-white text-white dark:text-white light:text-slate-900"
                  >
                    Test
                  </TabsTrigger>
                  <TabsTrigger
                    value="odi"
                    className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-white/20 light:data-[state=active]:bg-white text-white dark:text-white light:text-slate-900"
                  >
                    ODI
                  </TabsTrigger>
                  <TabsTrigger
                    value="t20"
                    className="data-[state=active]:bg-white/20 dark:data-[state=active]:bg-white/20 light:data-[state=active]:bg-white text-white dark:text-white light:text-slate-900"
                  >
                    T20
                  </TabsTrigger>
                </TabsList>

                {["test", "odi", "t20"].map((format) => (
                  <TabsContent key={format} value={format} className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <div className="text-center p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
                        <div className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                          {team.stats[format as keyof typeof team.stats].matches}
                        </div>
                        <div className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Matches</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
                        <div className="text-2xl font-bold text-green-400">
                          {team.stats[format as keyof typeof team.stats].wins}
                        </div>
                        <div className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Wins</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
                        <div className="text-2xl font-bold text-red-400">
                          {team.stats[format as keyof typeof team.stats].losses}
                        </div>
                        <div className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Losses</div>
                      </div>
                      {team.stats[format as keyof typeof team.stats].draws !== undefined && (
                        <div className="text-center p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
                          <div className="text-2xl font-bold text-yellow-400">
                            {team.stats[format as keyof typeof team.stats].draws}
                          </div>
                          <div className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Draws</div>
                        </div>
                      )}
                      <div className="text-center p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
                        <div className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                          {team.stats[format as keyof typeof team.stats].winPercentage}%
                        </div>
                        <div className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Win %</div>
                      </div>
                      <div className="text-center p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200">
                        <div className="text-2xl font-bold text-blue-400">
                          #{team.stats[format as keyof typeof team.stats].ranking}
                        </div>
                        <div className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">Ranking</div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Key Players */}
          <Card className="bg-white/10 dark:bg-white/10 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Key Players
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-300 light:text-slate-600">
                Top performers in the current squad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {team.keyPlayers.map((player, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white dark:text-white light:text-slate-900">{player.name}</h3>
                        <p className="text-sm text-gray-300 dark:text-gray-300 light:text-slate-600">{player.role}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300 dark:text-gray-300 light:text-slate-600">Average</span>
                        <span className="text-white dark:text-white light:text-slate-900 font-medium">
                          {player.average}
                        </span>
                      </div>
                      {player.wickets && (
                        <div className="flex justify-between">
                          <span className="text-gray-300 dark:text-gray-300 light:text-slate-600">Wickets</span>
                          <span className="text-white dark:text-white light:text-slate-900 font-medium">
                            {player.wickets}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/10 dark:bg-white/10 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Major Achievements
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-300 light:text-slate-600">
                Notable tournament victories and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white/5 dark:bg-white/5 light:bg-slate-50 rounded-lg border border-white/10 dark:border-white/10 light:border-slate-200"
                  >
                    <Award className="h-6 w-6 text-yellow-400 flex-shrink-0" />
                    <span className="text-white dark:text-white light:text-slate-900 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <Card className="bg-white/10 dark:bg-white/10 light:bg-white/90 border-white/20 dark:border-white/20 light:border-slate-200 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription className="text-gray-300 dark:text-gray-300 light:text-slate-600">
                Historical performance analysis and recent form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-white/60">
                Performance charts will be available soon
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
