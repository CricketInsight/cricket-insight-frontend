"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"
import { Radar, Line, Bar, Doughnut } from "react-chartjs-2"
import { Users, BarChart3, Target, Award, Activity, TrendingUp } from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"
import { playersApi, Player } from "@/lib/api/players"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
)

function PlayerComparisonHeader({ players }: { players: Player[] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {players.map((player, index) => (
            <div key={player.player_id} className="flex items-center gap-4">
              <Avatar className="w-20 h-20 ring-4 ring-white/30">
                {player.avatar ? (
                  <AvatarImage 
                    src={`https://p.imgci.com${player.avatar.replace('/lsci', '')}`} 
                    alt={player.name} 
                  />
                ) : null}
                <AvatarFallback className="bg-white/20 text-white text-lg">
                  {player.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-white">{player.name}</h2>
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    {player.countryFlag ? (
                      <img 
                        src={`https://p.imgci.com${player.countryFlag.replace('/lsci', '')}`} 
                        alt={player.country}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </div>
                <Badge className="bg-white/20 text-white mb-2">{player.country}</Badge>
                <p className="text-sm text-white/80">{player.role}</p>
                <p className="text-xs text-white/60">
                  Age: {player.dateOfBirth ? new Date().getFullYear() - player.dateOfBirth.year : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function OverallStatsComparison({ players }: { players: Player[] }) {
  const data = {
    labels: ['Total Matches', 'Total Runs', 'Overall Average', 'Total Centuries', 'Total Fifties'],
    datasets: players.map((player, index) => ({
      label: player.name,
      data: [
        player.career_averages?.reduce((total, stat) => total + stat.matches, 0) || 0,
        player.career_averages?.reduce((total, stat) => total + stat.runs, 0) || 0,
        player.career_averages?.length ? 
          (player.career_averages.reduce((total, stat) => total + (stat.average || 0), 0) / player.career_averages.length) : 0,
        player.career_averages?.reduce((total, stat) => total + stat.hundreds, 0) || 0,
        player.career_averages?.reduce((total, stat) => total + stat.fifties, 0) || 0,
      ],
      backgroundColor: index === 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)',
      borderColor: index === 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }))
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
          <BarChart3 className="w-5 h-5 text-green-500" />
          Overall Statistics Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Head-to-head comparison of career totals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function FormatWiseComparison({ players }: { players: Player[] }) {
  const formats = ['Test', 'ODI', 'T20I']
  
  const data = {
    labels: formats,
    datasets: players.map((player, index) => ({
      label: `${player.name} - Runs`,
      data: formats.map(format => {
        const stat = player.career_averages?.find(s => s.type.toLowerCase() === format.toLowerCase())
        return stat?.runs || 0
      }),
      backgroundColor: index === 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(59, 130, 246, 0.8)',
      borderColor: index === 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(59, 130, 246, 1)',
      borderWidth: 2,
    }))
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
          <Target className="w-5 h-5 text-blue-500" />
          Format-wise Runs Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Performance across different cricket formats
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

function PerformanceRadarComparison({ players }: { players: Player[] }) {
  const getPlayerMetrics = (player: Player) => {
    const mainFormat = player.career_averages?.[0]
    if (!mainFormat) return [0, 0, 0, 0, 0]
    
    return [
      Math.min((mainFormat.average || 0) * 2, 100),
      Math.min((mainFormat.strike_rate || 0), 100),
      Math.min(mainFormat.hundreds * 5, 100),
      Math.min(mainFormat.fifties * 2, 100),
      Math.min(mainFormat.catches * 3, 100),
    ]
  }

  const data = {
    labels: ['Average', 'Strike Rate', 'Centuries', 'Fifties', 'Catches'],
    datasets: players.map((player, index) => ({
      label: player.name,
      data: getPlayerMetrics(player),
      backgroundColor: index === 0 ? 'rgba(168, 85, 247, 0.2)' : 'rgba(34, 197, 94, 0.2)',
      borderColor: index === 0 ? 'rgba(168, 85, 247, 1)' : 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      pointBackgroundColor: index === 0 ? 'rgba(168, 85, 247, 1)' : 'rgba(34, 197, 94, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
    }))
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
          Performance Radar Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Multi-dimensional performance comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <Radar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function BoundaryComparison({ players }: { players: Player[] }) {
  const data = {
    labels: players.map(p => p.name),
    datasets: [
      {
        label: 'Total Fours',
        data: players.map(player => 
          player.career_averages?.reduce((total, stat) => total + stat.fours, 0) || 0
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
      },
      {
        label: 'Total Sixes',
        data: players.map(player => 
          player.career_averages?.reduce((total, stat) => total + stat.sixes, 0) || 0
        ),
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
          Boundary Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Fours and sixes comparison
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

function StrikeRatePieChart({ players }: { players: Player[] }) {
  const data = {
    labels: players.map(p => p.name),
    datasets: [{
      data: players.map(player => {
        const totalStrikeRate = player.career_averages?.reduce((total, stat) => total + (stat.strike_rate || 0), 0) || 0
        return player.career_averages?.length ? totalStrikeRate / player.career_averages.length : 0
      }),
      backgroundColor: [
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)',
      ],
      borderColor: [
        'rgba(168, 85, 247, 1)',
        'rgba(34, 197, 94, 1)',
      ],
      borderWidth: 2,
    }]
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
  }

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Strike Rate Distribution
        </CardTitle>
        <CardDescription className="text-white/60">
          Overall strike rate comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Doughnut data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressBarsComparison({ players }: { players: Player[] }) {
  const getMaxValue = (stat: string) => {
    return Math.max(...players.map(player => {
      switch(stat) {
        case 'runs': return player.career_averages?.reduce((total, s) => total + s.runs, 0) || 0
        case 'centuries': return player.career_averages?.reduce((total, s) => total + s.hundreds, 0) || 0
        case 'fifties': return player.career_averages?.reduce((total, s) => total + s.fifties, 0) || 0
        case 'catches': return player.career_averages?.reduce((total, s) => total + s.catches, 0) || 0
        default: return 0
      }
    }))
  }

  const stats = [
    { key: 'runs', label: 'Total Runs', color: 'bg-green-500' },
    { key: 'centuries', label: 'Centuries', color: 'bg-yellow-500' },
    { key: 'fifties', label: 'Fifties', color: 'bg-blue-500' },
    { key: 'catches', label: 'Catches', color: 'bg-purple-500' },
  ]

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-500" />
          Performance Progress Bars
        </CardTitle>
        <CardDescription className="text-white/60">
          Visual comparison across key metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.map(stat => {
            const maxValue = getMaxValue(stat.key)
            return (
              <div key={stat.key} className="space-y-3">
                <h4 className="text-white font-semibold">{stat.label}</h4>
                {players.map(player => {
                  let value = 0
                  switch(stat.key) {
                    case 'runs': value = player.career_averages?.reduce((total, s) => total + s.runs, 0) || 0; break
                    case 'centuries': value = player.career_averages?.reduce((total, s) => total + s.hundreds, 0) || 0; break
                    case 'fifties': value = player.career_averages?.reduce((total, s) => total + s.fifties, 0) || 0; break
                    case 'catches': value = player.career_averages?.reduce((total, s) => total + s.catches, 0) || 0; break
                  }
                  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
                  
                  return (
                    <div key={player.player_id} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-white/80">{player.name}</div>
                      <div className="flex-1 bg-white/10 rounded-full h-4 relative">
                        <div 
                          className={`${stat.color} h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2`}
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="text-xs text-white font-semibold">
                            {stat.key === 'runs' ? value.toLocaleString() : value}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function FormatWiseDetailedTable({ players }: { players: Player[] }) {
  const formats = ['Test', 'ODI', 'T20I']
  
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          Format-wise Detailed Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Comprehensive breakdown by cricket format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {formats.map(format => {
            const formatStats = players.map(player => 
              player.career_averages?.find(s => s.type.toLowerCase() === format.toLowerCase())
            )
            
            return (
              <div key={format} className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">{format} Cricket</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-white text-sm">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left p-2">Player</th>
                        <th className="text-center p-2">Matches</th>
                        <th className="text-center p-2">Runs</th>
                        <th className="text-center p-2">Average</th>
                        <th className="text-center p-2">Strike Rate</th>
                        <th className="text-center p-2">100s</th>
                        <th className="text-center p-2">50s</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, index) => {
                        const stat = formatStats[index]
                        return (
                          <tr key={player.player_id} className="border-b border-white/10">
                            <td className="p-2 font-semibold">{player.name}</td>
                            <td className="text-center p-2">{stat?.matches || 0}</td>
                            <td className="text-center p-2">{stat?.runs || 0}</td>
                            <td className="text-center p-2">{stat?.average?.toFixed(2) || 'N/A'}</td>
                            <td className="text-center p-2">{stat?.strike_rate?.toFixed(2) || 'N/A'}</td>
                            <td className="text-center p-2">{stat?.hundreds || 0}</td>
                            <td className="text-center p-2">{stat?.fifties || 0}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function PlayerInsights({ players }: { players: Player[] }) {
  const getInsights = () => {
    const insights = []
    
    // Age comparison
    const ages = players.map(p => p.dateOfBirth ? new Date().getFullYear() - p.dateOfBirth.year : 0)
    const youngerPlayer = ages[0] < ages[1] ? players[0] : players[1]
    const ageDiff = Math.abs(ages[0] - ages[1])
    if (ageDiff > 0) {
      insights.push(`${youngerPlayer.name} is ${ageDiff} years younger than the other player.`)
    }
    
    // Experience comparison
    const totalMatches = players.map(p => p.career_averages?.reduce((total, stat) => total + stat.matches, 0) || 0)
    const moreExperienced = totalMatches[0] > totalMatches[1] ? players[0] : players[1]
    const matchesDiff = Math.abs(totalMatches[0] - totalMatches[1])
    if (matchesDiff > 0) {
      insights.push(`${moreExperienced.name} has played ${matchesDiff} more matches in their career.`)
    }
    
    // Runs comparison
    const totalRuns = players.map(p => p.career_averages?.reduce((total, stat) => total + stat.runs, 0) || 0)
    const higherScorer = totalRuns[0] > totalRuns[1] ? players[0] : players[1]
    const runsDiff = Math.abs(totalRuns[0] - totalRuns[1])
    if (runsDiff > 0) {
      insights.push(`${higherScorer.name} has scored ${runsDiff.toLocaleString()} more runs in their career.`)
    }
    
    // Centuries comparison
    const totalCenturies = players.map(p => p.career_averages?.reduce((total, stat) => total + stat.hundreds, 0) || 0)
    const moreCenturies = totalCenturies[0] > totalCenturies[1] ? players[0] : players[1]
    const centuriesDiff = Math.abs(totalCenturies[0] - totalCenturies[1])
    if (centuriesDiff > 0) {
      insights.push(`${moreCenturies.name} has ${centuriesDiff} more centuries than the other player.`)
    }
    
    return insights
  }
  
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Key Insights
        </CardTitle>
        <CardDescription className="text-white/60">
          Notable differences and highlights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {getInsights().map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/80 text-sm leading-relaxed">{insight}</p>
            </div>
          ))}
          
          {/* Playing Style Comparison */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map(player => (
              <div key={player.player_id} className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">{player.name}'s Profile</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Playing Style:</span>
                    <span className="text-white">{player.battingStyle?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Height:</span>
                    <span className="text-white">{player.height ? `${player.height} cm` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Teams:</span>
                    <span className="text-white">{player.teams?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailedStatsTable({ players }: { players: Player[] }) {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-yellow-500" />
          Detailed Statistics Comparison
        </CardTitle>
        <CardDescription className="text-white/60">
          Side-by-side statistical breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left p-3 text-white/80">Statistic</th>
                {players.map(player => (
                  <th key={player.player_id} className="text-center p-3 text-white/80">
                    {player.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="p-3 text-white/60">Total Matches</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {player.career_averages?.reduce((total, stat) => total + stat.matches, 0) || 0}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-3 text-white/60">Total Runs</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {(player.career_averages?.reduce((total, stat) => total + stat.runs, 0) || 0).toLocaleString()}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-3 text-white/60">Overall Average</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {player.career_averages?.length ? 
                      (player.career_averages.reduce((total, stat) => total + (stat.average || 0), 0) / player.career_averages.length).toFixed(2) : 
                      'N/A'
                    }
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-3 text-white/60">Total Centuries</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {player.career_averages?.reduce((total, stat) => total + stat.hundreds, 0) || 0}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-3 text-white/60">Total Fifties</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {player.career_averages?.reduce((total, stat) => total + stat.fifties, 0) || 0}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/10">
                <td className="p-3 text-white/60">Total Fours</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {player.career_averages?.reduce((total, stat) => total + stat.fours, 0) || 0}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-white/60">Total Sixes</td>
                {players.map(player => (
                  <td key={player.player_id} className="text-center p-3 font-semibold">
                    {player.career_averages?.reduce((total, stat) => total + stat.sixes, 0) || 0}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlayerComparisonResult() {
  const searchParams = useSearchParams()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true)
        const playerIds = searchParams.get('players')?.split(',') || []
        
        if (playerIds.length === 2) {
          const playerPromises = playerIds.map(id => playersApi.getPlayer(Number(id)))
          const playersData = await Promise.all(playerPromises)
          setPlayers(playersData)
        }
      } catch (error) {
        console.error("Failed to fetch players:", error)
        setPlayers([])
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading comparison...</div>
      </div>
    )
  }

  if (players.length !== 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Invalid comparison data</div>
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Player Comparison</h1>
                <p className="text-xs text-slate-400">Head-to-head statistical analysis</p>
              </div>
            </div>
            <NavigationMenu />
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Player Headers */}
          <PlayerComparisonHeader players={players} />

          {/* Overall Stats Comparison */}
          <OverallStatsComparison players={players} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FormatWiseComparison players={players} />
            <PerformanceRadarComparison players={players} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BoundaryComparison players={players} />
            <StrikeRatePieChart players={players} />
          </div>

          {/* Progress Bars Comparison */}
          <ProgressBarsComparison players={players} />

          {/* Format-wise Detailed Tables */}
          <FormatWiseDetailedTable players={players} />

          {/* Text-based Insights */}
          <PlayerInsights players={players} />

          {/* Detailed Stats Table */}
          <DetailedStatsTable players={players} />
        </div>
      </main>
    </div>
  )
}