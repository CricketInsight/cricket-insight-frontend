"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"
import { Radar, Line, Bar } from "react-chartjs-2"
import { Target, Award, Activity, TrendingUp, BarChart3, Search, X } from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"
import { playersApi, Player } from "@/lib/api/players"
import { useRouter } from "next/navigation"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler,
)

function PlayerSearchBar({ onPlayerSelect }: { onPlayerSelect: (playerId: string) => void }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handlePlayerSearch = async (searchTerm: string) => {
      if (searchTerm.length > 2) {
        try {
          const results = await playersApi.searchPlayers(searchTerm, { limit: 8 })
          setSuggestions(results)
          setShowSuggestions(true)
        } catch (error) {
          console.error("Failed to search players:", error)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      handlePlayerSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handlePlayerSelect = (player: Player) => {
    console.log('Player selected:', player)
    setSearchTerm(player.name)
    setShowSuggestions(false)
    window.location.href = `/player/${player.cricInfoPlayerId}`
  }

  const clearSearch = () => {
    setSearchTerm("")
    setShowSuggestions(false)
  }

  const getSearchBarRect = () => {
    if (searchRef.current) {
      return searchRef.current.getBoundingClientRect()
    }
    return null
  }

  const searchBarRect = getSearchBarRect()

  return (
    <>
      <div ref={searchRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 transition-all duration-300 text-sm"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-lg rounded-lg border border-white/20 shadow-2xl max-h-80 overflow-y-auto z-50">
            {suggestions.map((player, index) => (
              <div
                key={player.player_id}
                onClick={() => handlePlayerSelect(player)}
                className={`flex items-center gap-3 p-4 hover:bg-white/10 cursor-pointer transition-all duration-200 ${
                  index === 0 ? "rounded-t-lg" : ""
                } ${index === suggestions.length - 1 ? "rounded-b-lg" : "border-b border-white/10"}`}
              >
                <Avatar className="h-10 w-10">
                  {player.avatar ? (
                    <AvatarImage 
                      src={`https://p.imgci.com${player.avatar.replace('/lsci', '')}`} 
                      alt={player.name} 
                    />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm">
                    {player.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{player.name}</div>
                  <div className="text-xs text-white/60">{player.country}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function PlayerHeader({ player }: { player: Player }) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 ring-4 ring-white/30">
            {player.avatar ? (
              <AvatarImage 
                src={`https://p.imgci.com${player.avatar.replace('/lsci', '')}`} 
                alt={player.name} 
              />
            ) : null}
            <AvatarFallback className="bg-white/20 text-white text-2xl">
              {player.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-4xl font-bold text-white/80">{player.name}</h1>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                {player.countryFlag ? (
                  <img 
                    src={`https://p.imgci.com${player.countryFlag.replace('/lsci', '')}`} 
                    alt={player.country}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling!.style.display = 'inline'
                    }}
                  />
                ) : null}
                <span className={`text-2xl text-white/80 ${player.countryFlag ? 'hidden' : 'inline'}`}>🏏</span>
              </div>
              <Badge className="bg-white/20 text-white hover:bg-white/30 w-fit mx-auto md:mx-0">{player.country}</Badge>
            </div>

            <p className="text-lg text-white/90 mb-4">{player.role}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white/80">
                  {player.career_averages?.reduce((total, stat) => total + stat.matches, 0) || 0}
                </div>
                <div className="text-sm text-white/60">Total Matches</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white/80">
                  {player.career_averages?.reduce((total, stat) => total + stat.runs, 0)?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-white/60">Total Runs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white/80">
                  {player.career_averages?.length ? 
                    (player.career_averages.reduce((total, stat) => total + (stat.average || 0), 0) / player.career_averages.length).toFixed(2) : 
                    'N/A'
                  }
                </div>
                <div className="text-sm text-white/60">Overall Average</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white/80">
                  {player.dateOfBirth ? player.dateOfBirth.year : 'N/A'}
                </div>
                <div className="text-sm text-white/60">Birth Year</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FormatComparisonChart({ careerAverages }: { careerAverages: CareerAverage[] }) {
  const data = {
    labels: careerAverages.map(stat => stat.type),
    datasets: [
      {
        label: 'Runs',
        data: careerAverages.map(stat => stat.runs),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
      {
        label: 'Average',
        data: careerAverages.map(stat => stat.average || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-500" />
          Format Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Runs and averages across different formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function PerformanceRadarChart({ careerAverages }: { careerAverages: CareerAverage[] }) {
  if (!careerAverages.length) return null
  
  const mainFormat = careerAverages[0]
  const data = {
    labels: ['Average', 'Strike Rate', 'Centuries', 'Fifties', 'Catches'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          Math.min((mainFormat.average || 0) * 2, 100),
          Math.min((mainFormat.strike_rate || 0), 100),
          Math.min(mainFormat.hundreds * 5, 100),
          Math.min(mainFormat.fifties * 2, 100),
          Math.min(mainFormat.catches * 3, 100),
        ],
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        pointLabels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12,
          },
        },
        ticks: {
          display: false,
        },
      },
    },
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Performance Radar
        </CardTitle>
        <CardDescription className="text-white/60">
          Key performance metrics visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Radar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function BoundaryAnalysisChart({ careerAverages }: { careerAverages: CareerAverage[] }) {
  const data = {
    labels: careerAverages.map(stat => stat.type),
    datasets: [
      {
        label: 'Fours',
        data: careerAverages.map(stat => stat.fours),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
      {
        label: 'Sixes',
        data: careerAverages.map(stat => stat.sixes),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          Boundary Analysis
        </CardTitle>
        <CardDescription className="text-white/60">
          Fours and sixes across formats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function MilestonesChart({ careerAverages }: { careerAverages: CareerAverage[] }) {
  const data = {
    labels: careerAverages.map(stat => stat.type),
    datasets: [
      {
        label: 'Centuries',
        data: careerAverages.map(stat => stat.hundreds),
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderColor: 'rgba(251, 191, 36, 1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Fifties',
        data: careerAverages.map(stat => stat.fifties),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Milestones
        </CardTitle>
        <CardDescription className="text-white/60">
          Centuries and fifties by format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlayerProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [selectedPlayerId, setSelectedPlayerId] = useState(resolvedParams.id)
  const [playerData, setPlayerData] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true)
        const player = await playersApi.getPlayer(Number(selectedPlayerId))
        setPlayerData(player)
      } catch (error) {
        console.error("Failed to load player data:", error)
        setPlayerData(null)
      } finally {
        setLoading(false)
      }
    }

    if (selectedPlayerId) {
      fetchPlayerData()
    }
  }, [selectedPlayerId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading player data...</div>
      </div>
    )
  }

  if (!playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Player not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm"></div>
        <div className="relative px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-white font-bold text-lg">CI</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Player Profile</h1>
                <p className="text-xs text-slate-400">Detailed player statistics and analysis</p>
              </div>
            </div>
            <NavigationMenu />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Player Search */}
          <div className="flex justify-center">
            <PlayerSearchBar onPlayerSelect={setSelectedPlayerId} />
          </div>

          {/* Player Header */}
          <PlayerHeader player={playerData} />

          {/* Career Statistics Charts */}
          {playerData.career_averages && playerData.career_averages.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FormatComparisonChart careerAverages={playerData.career_averages} />
                <PerformanceRadarChart careerAverages={playerData.career_averages} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <BoundaryAnalysisChart careerAverages={playerData.career_averages} />
                <MilestonesChart careerAverages={playerData.career_averages} />
              </div>
            </>
          )}

          {/* Career Statistics Table */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Career Statistics
              </CardTitle>
              <CardDescription className="text-gray-300">
                Detailed performance data across different formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {playerData.career_averages && playerData.career_averages.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {playerData.career_averages.map((stat, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">{stat.type}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stat.matches}</div>
                            <div className="text-sm text-gray-300">Matches</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stat.runs}</div>
                            <div className="text-sm text-gray-300">Runs</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stat.average?.toFixed(2) || 'N/A'}</div>
                            <div className="text-sm text-gray-300">Average</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stat.strike_rate?.toFixed(2) || 'N/A'}</div>
                            <div className="text-sm text-gray-300">Strike Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stat.hundreds}</div>
                            <div className="text-sm text-gray-300">Centuries</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{stat.fifties}</div>
                            <div className="text-sm text-gray-300">Fifties</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/60">
                    No career statistics available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Player Teams */}
          {playerData.teams && playerData.teams.length > 0 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Teams
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Teams the player has represented
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playerData.teams.map((team, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                        {team.team_image_url ? (
                          <img 
                            src={`https://p.imgci.com${team.team_image_url.replace('/lsci', '')}`} 
                            alt={team.team_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.nextElementSibling!.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <span className={`text-white font-bold text-xs ${team.team_image_url ? 'hidden' : 'flex'}`}>
                          {team.team_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white">{team.team_name}</div>
                        <div className="text-sm text-white/60">{team.country_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Info */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Player Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-white/60">Full Name</div>
                    <div className="text-white font-semibold">{playerData.fullName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Role</div>
                    <div className="text-white font-semibold">{playerData.role}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Batting Style</div>
                    <div className="text-white font-semibold">{playerData.battingStyle?.join(", ") || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Bowling Style</div>
                    <div className="text-white font-semibold">{playerData.bowlingStyle?.join(", ") || 'N/A'}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-white/60">Date of Birth</div>
                    <div className="text-white font-semibold">
                      {playerData.dateOfBirth ? 
                        `${playerData.dateOfBirth.date}/${playerData.dateOfBirth.month}/${playerData.dateOfBirth.year}` : 
                        'N/A'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Place of Birth</div>
                    <div className="text-white font-semibold">{playerData.placeOfBirth || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Height</div>
                    <div className="text-white font-semibold">{playerData.height ? `${playerData.height} cm` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Gender</div>
                    <div className="text-white font-semibold">{playerData.gender || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}