"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationMenu } from "@/components/navigation-menu"
import { MatchCardSkeleton } from "@/components/skeletons/match-card-skeleton"
import { useLoading } from "@/hooks/use-loading"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Play,
  CheckCircle,
  TrendingUp,
  Star,
  Eye,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react"
import { matchesApi, type Match } from "@/lib/api/matches"

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const { isLoading, startLoading, stopLoading } = useLoading()

  const formats = ["all", "Test", "ODI", "T20I", "IPL", "PSL", "BBL"]
  const statuses = ["all", "abandoned", "completed", "drinks", "live", "no result", "not covered live", "upcoming"]
  const teams = [
    "all",
    "India",
    "Australia",
    "England",
    "Pakistan",
    "New Zealand",
    "South Africa",
    "West Indies",
    "Sri Lanka",
    "Bangladesh",
    "Afghanistan",
  ]

  useEffect(() => {
    fetchMatches(1, false)
    setPage(1)
    
    // Set up WebSocket for live matches with error handling
    let ws: WebSocket | null = null
    
    try {
      ws = new WebSocket('ws://localhost:8000/ws/live-matches')
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'live_matches' && data.data) {
            // Update matches with live data
            setMatches(prevMatches => {
              const updatedMatches = [...prevMatches]
              
              // Update existing matches with live data
              Object.entries(data.data).forEach(([matchId, liveMatchData]: [string, any]) => {
                const matchIndex = updatedMatches.findIndex(match => match.match_id === matchId)
                if (matchIndex !== -1) {
                  updatedMatches[matchIndex] = {
                    ...updatedMatches[matchIndex],
                    ...liveMatchData,
                    status: 'live'
                  }
                }
              })
              
              return updatedMatches
            })
          }
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error)
        }
      }
      
      ws.onerror = () => {
        // Silently handle WebSocket errors - server may not be available
      }
      
      ws.onclose = () => {
        // Silently handle WebSocket close
      }
    } catch (error) {
      // WebSocket creation failed - server not available
    }
    
    // Cleanup WebSocket on unmount
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, [])

  useEffect(() => {
    filterMatches()
  }, [matches, searchQuery, selectedFormat, selectedStatus, selectedTeam])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchMatches(1, false)
  }, [searchQuery, selectedFormat, selectedStatus, selectedTeam])

  const fetchMatches = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) startLoading()
      else setLoadingMore(true)
      
      const response = await matchesApi.getMatches({ page: pageNum, limit: 20 })
      const newMatches = response.data || []
      
      if (append) {
        setMatches(prev => {
          const existingIds = new Set(prev.map(m => m.match_id))
          const uniqueNewMatches = newMatches.filter(m => !existingIds.has(m.match_id))
          return [...prev, ...uniqueNewMatches]
        })
      } else {
        setMatches(newMatches)
      }
      
      setHasMore(response.hasMore || false)
    } catch (error) {
      console.error("Failed to fetch matches:", error)
      if (!append) setMatches([])
    } finally {
      if (pageNum === 1) stopLoading()
      else setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchMatches(nextPage, true)
    }
  }, [page, loadingMore, hasMore])

  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loadingMore)

  const filterMatches = () => {
    let filtered = matches || []

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (match) =>
          match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.series.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Format filter
    if (selectedFormat !== "all") {
      filtered = filtered.filter((match) => match.format === selectedFormat)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((match) => match.status === selectedStatus)
    }

    // Team filter
    if (selectedTeam !== "all") {
      filtered = filtered.filter((match) => match.team1.name === selectedTeam || match.team2.name === selectedTeam)
    }

    setFilteredMatches(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Play className="w-4 h-4 text-red-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "upcoming":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "abandoned":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "drinks":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "no result":
        return <Clock className="w-4 h-4 text-gray-500" />
      case "not covered live":
        return <Clock className="w-4 h-4 text-purple-500" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Live</Badge>
      case "completed":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>
      case "abandoned":
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Abandoned</Badge>
      case "drinks":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Drinks</Badge>
      case "no result":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">No Result</Badge>
      case "not covered live":
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Not Covered Live</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedFormat("all")
    setSelectedStatus("all")
    setSelectedTeam("all")
  }

  const liveMatches = filteredMatches.filter((match) => match.status === "live")
  const upcomingMatches = filteredMatches.filter((match) => match.status === "upcoming")
  const completedMatches = filteredMatches.filter((match) => match.status === "completed")
  const abandonedMatches = filteredMatches.filter((match) => match.status === "abandoned")
  const drinksMatches = filteredMatches.filter((match) => match.status === "drinks")
  const noresultMatches = filteredMatches.filter((match) => match.status === "no result")
  const notCoveredMatches = filteredMatches.filter((match) => match.status === "not covered live")


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
  
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 dark:from-slate-900/90 dark:via-purple-900/90 dark:to-slate-900/90 light:from-slate-800/95 light:via-blue-900/95 light:to-slate-800/95 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-lg">CI</span>
              </div>
              <div>
                 <h1 className="text-xl font-bold text-white">Cricket Matches</h1>
                <p className="text-xs text-slate-400">Live & Upcoming Games</p>
              </div>
            </div>
            <NavigationMenu currentPage="matches" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Search & Filters
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={clearFilters}
                className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search matches, teams, venues, or tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {formats.map((format) => (
                    <option key={format} value={format}>
                      {format === "all" ? "All Formats" : format}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full bg-slate-700/50 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team === "all" ? "All Teams" : team}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matches Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-slate-700 text-slate-300">
              All Matches ({filteredMatches.length})
            </TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-slate-700 text-slate-300">
              Live ({liveMatches.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-slate-700 text-slate-300">
              Upcoming ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-slate-700 text-slate-300">
              Completed ({completedMatches.length})
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="data-[state=active]:bg-slate-700 text-slate-300">
              Abandoned ({abandonedMatches.length})
            </TabsTrigger>
            <TabsTrigger value="no result" className="data-[state=active]:bg-slate-700 text-slate-300">
              No Result ({noresultMatches.length})
            </TabsTrigger>
          </TabsList>

          {/* All Matches */}
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)
                : filteredMatches.map((match, index) => (
                    <Card
                      key={`all-${match.match_id}-${index}`}
                      ref={index === filteredMatches.length - 1 ? lastElementRef : null}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(match.status)}
                            {getStatusBadge(match.status)}
                          </div>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {match.format}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-right">
                              <p className="font-semibold text-white">{match.team1.name}</p>
                            </div>
                            <div className="text-slate-400 text-sm">vs</div>
                            <div className="text-left">
                              <p className="font-semibold text-white">{match.team2.name}</p>
                            </div>
                          </div>
                          {match.result && <p className="text-sm text-green-400 font-medium">{match.result}</p>}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{match.series}</span>
                          </div>
                          {match.player_of_match && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-xs">Player of Match: {match.player_of_match}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => (window.location.href = `/matches/${match.match_id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          {/* Live Matches */}
          <TabsContent value="live">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)
                : liveMatches.map((match) => (
                    <Card
                      key={match.match_id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 ring-2 ring-red-500/20"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">LIVE</Badge>
                          </div>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {match.format}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-right">
                              <p className="font-semibold text-white">{match.team1.name}</p>
                            </div>
                            <div className="text-slate-400 text-sm">vs</div>
                            <div className="text-left">
                              <p className="font-semibold text-white">{match.team2.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-red-400 font-medium">Match in progress</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{match.series}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            onClick={() => (window.location.href = `/matches/${match.match_id}`)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch Live
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          {/* Upcoming Matches */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)
                : upcomingMatches.map((match) => (
                    <Card
                      key={match.match_id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {match.format}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-right">
                              <p className="font-semibold text-white">{match.team1.name}</p>
                            </div>
                            <div className="text-slate-400 text-sm">vs</div>
                            <div className="text-left">
                              <p className="font-semibold text-white">{match.team2.name}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{match.series}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => (window.location.href = `/matches/${match.match_id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          {/* Completed Matches */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <MatchCardSkeleton key={i} />)
                : completedMatches.map((match) => (
                    <Card
                      key={match.match_id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Completed</Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {match.format}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-right">
                              <p className="font-semibold text-white">{match.team1.name}</p>
                            </div>
                            <div className="text-slate-400 text-sm">vs</div>
                            <div className="text-left">
                              <p className="font-semibold text-white">{match.team2.name}</p>
                            </div>
                          </div>
                          {match.result && <p className="text-sm text-green-400 font-medium">{match.result}</p>}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{match.series}</span>
                          </div>
                          {match.player_of_match && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="text-xs">Player of Match: {match.player_of_match}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => (window.location.href = `/matches/${match.match_id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Scorecard
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          {/* Abandoned Matches */}
          <TabsContent value="abandoned">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)
                : abandonedMatches.map((match) => (
                    <Card
                      key={match.match_id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Abandoned</Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {match.format}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-right">
                              <p className="font-semibold text-white">{match.team1.name}</p>
                            </div>
                            <div className="text-slate-400 text-sm">vs</div>
                            <div className="text-left">
                              <p className="font-semibold text-white">{match.team2.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-orange-400 font-medium">Match abandoned</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{match.series}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-orange-600 hover:bg-orange-700"
                            onClick={() => (window.location.href = `/matches/${match.match_id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>

          {/* No Result Matches */}
          <TabsContent value="no result">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={i} />)
                : noresultMatches.map((match) => (
                    <Card
                      key={match.match_id}
                      className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">No Result</Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {match.format}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-2">
                            <div className="text-right">
                              <p className="font-semibold text-white">{match.team1.name}</p>
                            </div>
                            <div className="text-slate-400 text-sm">vs</div>
                            <div className="text-left">
                              <p className="font-semibold text-white">{match.team2.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-400 font-medium">No result</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span>{match.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{new Date(match.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-slate-400" />
                            <span>{match.series}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-gray-600 hover:bg-gray-700"
                            onClick={() => (window.location.href = `/matches/${match.match_id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 3 }).map((_, i) => <MatchCardSkeleton key={`loading-more-${i}`} />)}
          </div>
        )}

        {/* Scroll Target */}
        <div ref={lastElementRef} className="h-4" />

        {/* No Results */}
        {!isLoading && filteredMatches.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No matches found</h3>
              <p className="text-slate-400 mb-4">
                Try adjusting your search criteria or clear the filters to see all matches.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}