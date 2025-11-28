"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavigationMenu } from "@/components/navigation-menu"
import { Trophy, Users, Target, Star, Search, Globe, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { teamsApi, Team_Root } from "@/lib/api/teams"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team_Root[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchTeams = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)
      
      const response = await teamsApi.getTeams({ page: pageNum, limit: 10 })
      const newTeams = response.data || []
      
      if (append) {
        setTeams(prev => {
          const existingIds = new Set(prev.map(t => t.id))
          const uniqueNewTeams = newTeams.filter(t => !existingIds.has(t.id))
          return [...prev, ...uniqueNewTeams]
        })
      } else {
        setTeams(newTeams)
      }
      
      setHasMore(response.hasMore || false)
    } catch (error) {
      console.error('Failed to fetch teams:', error)
      if (!append) setTeams([])
    } finally {
      if (pageNum === 1) setLoading(false)
      else setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchTeams(nextPage, true)
    }
  }, [page, loadingMore, hasMore])

  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loadingMore)

  useEffect(() => {
    fetchTeams(1, false)
    setPage(1)
  }, [])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setPage(1)
        setHasMore(true)
        fetchTeams(1, false)
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Filter teams locally instead of making API calls
  const filteredTeams = (teams || []).filter(team => {
    const matchesSearch = !searchTerm || 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.abbreviation.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFormat = selectedFormat === 'all' || true // Format filtering can be added later
    
    return matchesSearch && matchesFormat
  })

  const getWinPercentage = (team: Team_Root) => {
    const results = team.content?.recentResults || []
    if (results.length === 0) return 0
    const wins = results.filter(r => r.winnerTeamId === parseInt(team.team_id)).length
    return Math.round((wins / results.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Cricket Teams</h1>
                <p className="text-sm text-gray-300">International Cricket Teams</p>
              </div>
            </div>
            <NavigationMenu currentPage="teams" />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <div className="flex gap-2 ">
              <Button
                variant={selectedFormat === "all" ? "default" : "outline"}
                onClick={() => setSelectedFormat("all")}
                className="text-white bg-white/10 border-white/20"
              >
                All Formats
              </Button>
              <Button
                variant={selectedFormat === "test" ? "default" : "outline"}
                onClick={() => setSelectedFormat("test")}
                className="text-white bg-white/10 border-white/20"
              >
                Test
              </Button>
              <Button
                variant={selectedFormat === "odi" ? "default" : "outline"}
                onClick={() => setSelectedFormat("odi")}
                className="text-white bg-white/10 border-white/20"
              >
                ODI
              </Button>
              <Button
                variant={selectedFormat === "t20" ? "default" : "outline"}
                onClick={() => setSelectedFormat("t20")}
                className="text-white bg-white/10 border-white/20"
              >
                T20
              </Button>
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-16 bg-white/20 rounded" />
                      <div className="h-8 bg-white/20 rounded" />
                      <div className="h-12 bg-white/20 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team) => {
                const winPercentage = getWinPercentage(team)
                const recentMatches = team.content?.recentResults?.length || 0
                const totalPlayers = team.team?.totalPlayers || 0
                const totalSquads = team.team?.totalSquads || 0
                
                return (
                  <Card 
                    key={team.id} 
                    ref={filteredTeams.indexOf(team) === filteredTeams.length - 1 ? lastElementRef : null}
                    className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
                            {team.logo ? (
                              <img 
                              src={`https://p.imgci.com${team.logo.replace('/lsci', '')}`}  alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                {team.flag || '🏏'}
                              </div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{team.name}</CardTitle>
                            <CardDescription className="text-white/60">{team.abbreviation}</CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                          {team.isCountry ? 'INT' : 'DOM'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats */}
                       {/* Team Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Full Name:</span>
                          <span className="text-white text-right">{team.longName}</span>
                        </div>
                        {/* <div className="flex justify-between">
                          <span className="text-white/60">Total Content:</span>
                          <span className="text-white flex items-center gap-1">
                            {team.team?.totalVideos || 0} <Globe className="w-3 h-3 text-blue-400" />
                          </span>
                        </div> */}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-white">{recentMatches}</div>
                          <div className="text-xs text-white/60">Recent Matches</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{winPercentage}%</div>
                          <div className="text-xs text-white/60">Win Rate</div>
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="text-lg font-bold text-blue-400">{totalPlayers}</div>
                          <div className="text-xs text-white/60">Total Players</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="text-lg font-bold text-purple-400">{totalSquads}</div>
                          <div className="text-xs text-white/60">Total Squads</div>
                        </div>
                      </div>
                        
                        <div className="space-y-2 text-sm">
                     
                         </div>
                     

                      {/* Action Button */}
                      <Link href={`/teams/${team.id}`}>
                        <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-white/60 text-lg">No teams found matching your search.</div>
              </div>
            )}
            {loadingMore && Array.from({ length: 3 }).map((_, i) => (
              <Card key={`loading-${i}`} className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-white/20 rounded" />
                    <div className="h-8 bg-white/20 rounded" />
                    <div className="h-12 bg-white/20 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div ref={lastElementRef} className="h-4" />
        </div>
      </main>
    </div>
  )
}