"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, MapPin, Activity, Search, Filter, ArrowLeft, Play, BarChart3 } from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"

// Mock match data
const allMatches = [
  {
    id: 1,
    team1: { name: "India", flag: "🇮🇳", score: "287/6", overs: "50.0" },
    team2: { name: "Australia", flag: "🇦🇺", score: "245/8", overs: "50.0" },
    format: "ODI",
    status: "live",
    result: "India batting",
    venue: "Melbourne Cricket Ground",
    date: "2024-01-15",
    time: "14:30",
    series: "Border-Gavaskar Trophy",
    weather: "Sunny, 28°C",
    toss: "India won the toss and elected to bat",
    playerOfMatch: "Virat Kohli",
    highlights: ["Kohli's century", "Bumrah's 4-wicket haul"],
  },
  {
    id: 2,
    team1: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "156/7", overs: "20.0" },
    team2: { name: "Pakistan", flag: "🇵🇰", score: "142/9", overs: "20.0" },
    format: "T20",
    status: "completed",
    result: "England won by 14 runs",
    venue: "Lord's Cricket Ground",
    date: "2024-01-14",
    time: "19:00",
    series: "T20 International Series",
    weather: "Cloudy, 22°C",
    toss: "Pakistan won the toss and elected to field",
    playerOfMatch: "Jos Buttler",
    highlights: ["Buttler's quick-fire 65", "Shaheen's 3 wickets"],
  },
  {
    id: 3,
    team1: { name: "South Africa", flag: "🇿🇦", score: "320/4", overs: "90.0" },
    team2: { name: "New Zealand", flag: "🇳🇿", score: "285/6", overs: "85.0" },
    format: "Test",
    status: "upcoming",
    result: "Match starts in 2d 10h 30m",
    venue: "Newlands Cricket Ground",
    date: "2024-01-16",
    time: "10:00",
    series: "Test Championship",
    weather: "Partly cloudy, 25°C",
    toss: "TBD",
    playerOfMatch: "TBD",
    highlights: [],
  },
  {
    id: 4,
    team1: { name: "West Indies", flag: "🇼🇸", score: "vs", overs: "" },
    team2: { name: "Sri Lanka", flag: "🇱🇰", score: "", overs: "" },
    format: "ODI",
    status: "upcoming",
    result: "Match starts in 2 hours",
    venue: "Kensington Oval",
    date: "2024-01-17",
    time: "14:00",
    series: "Caribbean Cup",
    weather: "Sunny, 30°C",
    toss: "TBD",
    playerOfMatch: "TBD",
    highlights: [],
  },
  {
    id: 5,
    team1: { name: "Bangladesh", flag: "🇧🇩", score: "178/5", overs: "20.0" },
    team2: { name: "Afghanistan", flag: "🇦🇫", score: "165/8", overs: "20.0" },
    format: "T20",
    status: "completed",
    result: "Bangladesh won by 13 runs",
    venue: "Shere Bangla National Stadium",
    date: "2024-01-13",
    time: "18:30",
    series: "Asia Cup T20",
    weather: "Humid, 32°C",
    toss: "Afghanistan won the toss and elected to field",
    playerOfMatch: "Shakib Al Hasan",
    highlights: ["Shakib's all-round performance", "Rashid's economical bowling"],
  },
]

const formats = ["All", "Test", "ODI", "T20"]
const statuses = ["All", "live", "completed", "upcoming"]

function MatchCard({ match }: { match: (typeof allMatches)[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-500 animate-pulse"
      case "completed":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <Play className="w-3 h-3" />
      case "completed":
        return <Trophy className="w-3 h-3" />
      case "upcoming":
        return <Clock className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(match.status)} text-white border-0 flex items-center gap-1`}>
              {getStatusIcon(match.status)}
              {match.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white/80">
              {match.format}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs">{match.date}</div>
            <div className="text-white/60 text-xs">{match.time}</div>
          </div>
        </div>
        <CardTitle className="text-white/90 text-sm">{match.series}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams and Scores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{match.team1.flag}</span>
              <span className="text-white font-medium">{match.team1.name}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">{match.team1.score}</div>
              {match.team1.overs && <div className="text-white/60 text-xs">({match.team1.overs} overs)</div>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{match.team2.flag}</span>
              <span className="text-white font-medium">{match.team2.name}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">{match.team2.score}</div>
              {match.team2.overs && <div className="text-white/60 text-xs">({match.team2.overs} overs)</div>}
            </div>
          </div>
        </div>

        {/* Match Result */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="text-white/90 font-medium text-sm">{match.result}</div>
        </div>

        {/* Match Details */}
        <div className="space-y-2 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{match.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3" />
            <span>{match.weather}</span>
          </div>
          {match.playerOfMatch !== "TBD" && (
            <div className="flex items-center gap-2">
              <Trophy className="w-3 h-3" />
              <span>Player of the Match: {match.playerOfMatch}</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {match.highlights.length > 0 && (
          <div className="space-y-2">
            <div className="text-white/80 text-xs font-medium">Key Highlights:</div>
            <div className="flex flex-wrap gap-1">
              {match.highlights.map((highlight, index) => (
                <Badge
                  key={index}
                  className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white/80 border-white/20 text-xs"
                >
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link href={`/matches/${match.id}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 transition-all duration-300 hover:scale-105"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </Link>
          {match.status === "live" && (
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 bg-transparent"
            >
              <Play className="w-3 h-3 mr-1" />
              Live
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function MatchesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [formatFilter, setFormatFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [activeTab, setActiveTab] = useState("all")

  // Filter matches based on search and filters
  const filteredMatches = useMemo(() => {
    return allMatches.filter((match) => {
      const matchesSearch =
        searchTerm === "" ||
        match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.venue.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFormat = formatFilter === "All" || match.format === formatFilter
      const matchesStatus = statusFilter === "All" || match.status === statusFilter

      return matchesSearch && matchesFormat && matchesStatus
    })
  }, [searchTerm, formatFilter, statusFilter])

  // Group matches by status for tabs
  const liveMatches = filteredMatches.filter((m) => m.status === "live")
  const upcomingMatches = filteredMatches.filter((m) => m.status === "upcoming")
  const completedMatches = filteredMatches.filter((m) => m.status === "completed")

  const getMatchesByTab = () => {
    switch (activeTab) {
      case "live":
        return liveMatches
      case "upcoming":
        return upcomingMatches
      case "completed":
        return completedMatches
      default:
        return filteredMatches
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFormatFilter("All")
    setStatusFilter("All")
    setActiveTab("all")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = "/")}
                className="text-white hover:bg-white/10 p-2 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Trophy className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Cricket Matches
                </h1>
                <p className="text-xs text-white/60">Live scores and match updates</p>
              </div>
            </div>
            <NavigationMenu currentPage="matches" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
        {/* Search and Filters */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-400" />
              Search & Filter Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  placeholder="Search teams, series, venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40"
                />
              </div>

              {/* Format Filter */}
              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {formats.map((format) => (
                    <SelectItem key={format} value={format} className="text-white hover:bg-white/10">
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status} className="text-white hover:bg-white/10">
                      {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Match Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20">
            <TabsTrigger
              value="all"
              className="text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              All ({filteredMatches.length})
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              Live ({liveMatches.length})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              Upcoming ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              Completed ({completedMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {getMatchesByTab().length === 0 ? (
              <Card className="bg-white/10 border-white/20">
                <CardContent className="text-center py-12">
                  <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-white/80 text-lg font-medium mb-2">No matches found</h3>
                  <p className="text-white/60">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {getMatchesByTab().map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Match Statistics Summary */}
        {filteredMatches.length > 0 && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Match Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white/80">{filteredMatches.length}</div>
                  <div className="text-sm text-white/60">Total Matches</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{liveMatches.length}</div>
                  <div className="text-sm text-white/60">Live Now</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{upcomingMatches.length}</div>
                  <div className="text-sm text-white/60">Upcoming</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{completedMatches.length}</div>
                  <div className="text-sm text-white/60">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
