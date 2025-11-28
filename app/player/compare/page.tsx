"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavigationMenu } from "@/components/navigation-menu"
import { Search, Users, Eye } from "lucide-react"
import { playersApi, Player } from "@/lib/api/players"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"

function PlayerCard({
  player,
  isSelected,
  onSelect,
  onViewProfile,
}: {
  player: Player
  isSelected: boolean
  onSelect: () => void
  onViewProfile: (e: React.MouseEvent) => void
}) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        isSelected
          ? "bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-400/50 shadow-lg shadow-green-500/25"
          : "bg-slate-800/50 border-white/20 hover:bg-slate-800/50"
      } backdrop-blur-lg`}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            {player.avatar ? (
              <img 
                src={`https://p.imgci.com${player.avatar.replace('/lsci', '')}`} 
                alt={player.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling!.style.display = 'flex'
                }}
              />
            ) : null}
            <span className={`text-2xl ${player.avatar ? 'hidden' : 'flex'}`}>🏏</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white">{player.name}</h3>
            <p className="text-sm text-slate-300">{player.country}</p>
            <Badge variant="outline" className="mt-1 border-slate-500 text-slate-300">
              {player.role}
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Age</span>
            <span className="font-semibold text-white">
              {player.dateOfBirth ? new Date().getFullYear() - player.dateOfBirth.year : 'N/A'}
            </span>
          </div>

          {player.career_averages && player.career_averages.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Matches</span>
                <span className="font-semibold text-white">{player.career_averages[0]?.matches || 0}</span>
              </div>
              
              {player.role.toLowerCase().includes("batsman") || player.role.toLowerCase().includes("bat") ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Runs</span>
                    <span className="font-semibold text-white">{player.career_averages[0]?.runs || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Average</span>
                    <span className="font-semibold text-white">{player.career_averages[0]?.average?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Centuries</span>
                    <span className="font-semibold text-white">{player.career_averages[0]?.hundreds || 0}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Innings</span>
                    <span className="font-semibold text-white">{player.career_averages[0]?.innings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Strike Rate</span>
                    <span className="font-semibold text-white">{player.career_averages[0]?.strike_rate?.toFixed(2) || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Fifties</span>
                    <span className="font-semibold text-white">{player.career_averages[0]?.fifties || 0}</span>
                  </div>
                </>
              )}
            </>
          )}
          
          <Button
            onClick={onViewProfile}
            variant="outline"
            size="sm"
            className="w-full mt-4 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlayerComparePage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPlayers = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)
      
      const response = await playersApi.getPlayers({
        page: pageNum,
        limit: 20,
        sortBy: "name",
        sortOrder: "asc"
      })
      const newPlayers = response?.data || []
      
      if (append) {
        setPlayers(prev => {
          const existingIds = new Set(prev.map(p => p.player_id))
          const uniqueNewPlayers = newPlayers.filter(p => !existingIds.has(p.player_id))
          return [...prev, ...uniqueNewPlayers]
        })
      } else {
        setPlayers(newPlayers)
      }
      
      setHasMore(response?.hasMore || false)
    } catch (error) {
      console.error("Failed to fetch players:", error)
      if (!append) setPlayers([])
    } finally {
      if (pageNum === 1) setLoading(false)
      else setLoadingMore(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPlayers(nextPage, true)
    }
  }, [page, loadingMore, hasMore])

  const lastElementRef = useInfiniteScroll(loadMore, hasMore, loadingMore)

  useEffect(() => {
    fetchPlayers(1, false)
    setPage(1)
  }, [])

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || player.role.toLowerCase().includes(roleFilter.toLowerCase())
    const matchesCountry = teamFilter === "all" || player.country === teamFilter

    return matchesSearch && matchesRole && matchesCountry
  })

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId)
      } else if (prev.length < 2) {
        return [...prev, playerId]
      } else {
        return [prev[1], playerId]
      }
    })
  }

  const handleViewProfile = (playerId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/player/${playerId}`)
  }

  const handleCompare = () => {
    if (selectedPlayers.length === 2) {
      router.push(`/player/comparison-result?players=${selectedPlayers.join(",")}`)
    }
  }

  const countries = [...new Set(players.map((p) => p.country).filter(Boolean))]
  const roles = [...new Set(players.map((p) => p.role).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="relative z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm"></div>
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Player Comparison</h1>
                  <p className="text-xs text-slate-400">Compare cricket players side by side</p>
                </div>
              </div>
              <NavigationMenu />
            </div>
          </div>
        </header>
        <main className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="text-white/60 text-lg">Loading players...</div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Player Comparison</h1>
                <p className="text-xs text-slate-400">Compare cricket players side by side</p>
              </div>
            </div>
            <NavigationMenu />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="bg-slate-800/50 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Players
              </CardTitle>
              <CardDescription className="text-gray-300">
                Search and filter players to compare their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role.toLowerCase()}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <span className="text-lg font-semibold">Selected: {selectedPlayers.length}/2 players</span>
              {selectedPlayers.length > 0 && (
                <div className="text-sm text-white/70 mt-1">
                  {selectedPlayers
                    .map((id) => {
                      const player = players.find((p) => p.player_id === id)
                      return player?.name
                    })
                    .join(" vs ")}
                </div>
              )}
            </div>
            <Button
              onClick={handleCompare}
              disabled={selectedPlayers.length !== 2}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare Players
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map((player, index) => (
              <div
                key={`${player.player_id}-${index}`}
                ref={index === filteredPlayers.length - 1 ? lastElementRef : null}
              >
                <PlayerCard
                  player={player}
                  isSelected={selectedPlayers.includes(player.player_id)}
                  onSelect={() => handlePlayerSelect(player.player_id)}
                  onViewProfile={handleViewProfile(player.player_id)}
                />
              </div>
            ))}
            {loadingMore && Array.from({ length: 3 }).map((_, i) => (
              <div key={`loading-${i}`} className="bg-slate-800/50 border-white/20 rounded-lg p-6 animate-pulse">
                <div className="h-16 bg-white/20 rounded mb-4" />
                <div className="h-4 bg-white/20 rounded mb-2" />
                <div className="h-4 bg-white/20 rounded" />
              </div>
            ))}
          </div>

          {players.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-white/60 text-lg">No players available</div>
              <div className="text-white/40 text-sm mt-2">Player data will be loaded from API when available</div>
            </div>
          )}

          {filteredPlayers.length === 0 && players.length > 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 text-lg">No players found matching your criteria</div>
              <div className="text-white/40 text-sm mt-2">Try adjusting your search or filters</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}