"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart2,
  Star,
  Award,
  Users,
  Trophy,
  ArrowLeft,
  Zap,
  TrendingUp,
  Activity,
  Crown,
  Calendar,
  RefreshCw,
} from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"
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
import { Radar, Bar } from "react-chartjs-2"

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

// Enhanced player data
const allPlayers = [
  {
    id: 1,
    name: "Virat Kohli",
    country: "India",
    flag: "🇮🇳",
    avatar: "/placeholder.svg?height=80&width=80",
    role: "Right-Hand Batsman",
    badges: ["Chase Master", "Finisher", "Pressure Player"],
    stats: {
      T20: {
        average: 52.7,
        strikeRate: 138,
        hundreds: 1,
        chaseAvg: 60,
        boundaryPct: 18,
        wickets: 4,
        economy: 8.2,
        dotPct: 40,
        deathPerf: 0,
      },
      ODI: {
        average: 58.2,
        strikeRate: 93,
        hundreds: 46,
        chaseAvg: 65,
        boundaryPct: 20,
        wickets: 8,
        economy: 6.1,
        dotPct: 42,
        deathPerf: 0,
      },
      Test: {
        average: 49.3,
        strikeRate: 56,
        hundreds: 29,
        chaseAvg: 54,
        boundaryPct: 15,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
    },
    moments: [
      { year: 2008, label: "International Debut", icon: "award", iconColor: "text-blue-400" },
      { year: 2011, label: "World Cup Winner", icon: "trophy", iconColor: "text-yellow-400" },
      { year: 2012, label: "First ODI Century", icon: "star", iconColor: "text-orange-400" },
      { year: 2016, label: "T20I Player of the Year", icon: "award", iconColor: "text-purple-400" },
      { year: 2018, label: "Test Captain", icon: "crown", iconColor: "text-red-400" },
    ],
  },
  {
    id: 2,
    name: "Babar Azam",
    country: "Pakistan",
    flag: "🇵🇰",
    avatar: "/placeholder.svg?height=80&width=80",
    role: "Right-Hand Batsman",
    badges: ["Cover Drive King", "Spin Hunter", "Consistent"],
    stats: {
      T20: {
        average: 45.2,
        strikeRate: 130,
        hundreds: 3,
        chaseAvg: 48,
        boundaryPct: 16,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
      ODI: {
        average: 56.7,
        strikeRate: 89,
        hundreds: 19,
        chaseAvg: 60,
        boundaryPct: 18,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
      Test: {
        average: 48.6,
        strikeRate: 54,
        hundreds: 9,
        chaseAvg: 50,
        boundaryPct: 14,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
    },
    moments: [
      { year: 2015, label: "International Debut", icon: "award", iconColor: "text-blue-400" },
      { year: 2017, label: "First ODI Century", icon: "star", iconColor: "text-orange-400" },
      { year: 2019, label: "World Cup Appearance", icon: "trophy", iconColor: "text-yellow-400" },
      { year: 2022, label: "ICC ODI Player of the Year", icon: "award", iconColor: "text-purple-400" },
    ],
  },
  {
    id: 3,
    name: "Jos Buttler",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    avatar: "/placeholder.svg?height=80&width=80",
    role: "Wicket-Keeper Batsman",
    badges: ["Power Hitter", "Death Overs Specialist", "Innovative"],
    stats: {
      T20: {
        average: 35.8,
        strikeRate: 144,
        hundreds: 1,
        chaseAvg: 42,
        boundaryPct: 22,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
      ODI: {
        average: 40.3,
        strikeRate: 118,
        hundreds: 11,
        chaseAvg: 45,
        boundaryPct: 19,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
      Test: {
        average: 32.9,
        strikeRate: 58,
        hundreds: 2,
        chaseAvg: 38,
        boundaryPct: 12,
        wickets: 0,
        economy: 0,
        dotPct: 0,
        deathPerf: 0,
      },
    },
    moments: [
      { year: 2011, label: "International Debut", icon: "award", iconColor: "text-blue-400" },
      { year: 2019, label: "World Cup Winner", icon: "trophy", iconColor: "text-yellow-400" },
      { year: 2022, label: "T20 World Cup Winner", icon: "trophy", iconColor: "text-yellow-400" },
    ],
  },
  {
    id: 4,
    name: "Jasprit Bumrah",
    country: "India",
    flag: "🇮🇳",
    avatar: "/placeholder.svg?height=80&width=80",
    role: "Right-Arm Fast Bowler",
    badges: ["Death Overs Specialist", "Yorker King", "Match Winner"],
    stats: {
      T20: {
        average: 15.2,
        strikeRate: 120,
        hundreds: 0,
        chaseAvg: 18,
        boundaryPct: 8,
        wickets: 70,
        economy: 6.8,
        dotPct: 65,
        deathPerf: 85,
      },
      ODI: {
        average: 12.8,
        strikeRate: 95,
        hundreds: 0,
        chaseAvg: 15,
        boundaryPct: 6,
        wickets: 149,
        economy: 4.6,
        dotPct: 68,
        deathPerf: 88,
      },
      Test: {
        average: 10.9,
        strikeRate: 52,
        hundreds: 0,
        chaseAvg: 12,
        boundaryPct: 4,
        wickets: 159,
        economy: 2.7,
        dotPct: 72,
        deathPerf: 0,
      },
    },
    moments: [
      { year: 2016, label: "International Debut", icon: "award", iconColor: "text-blue-400" },
      { year: 2018, label: "Test Debut", icon: "star", iconColor: "text-orange-400" },
      { year: 2019, label: "World Cup Runner-up", icon: "trophy", iconColor: "text-yellow-400" },
      { year: 2021, label: "ICC Test Player of the Year", icon: "award", iconColor: "text-purple-400" },
    ],
  },
]

const formatList = ["T20", "ODI", "Test"] as const
type Format = (typeof formatList)[number]

function renderMomentIcon(icon: string, iconColor: string) {
  switch (icon) {
    case "award":
      return <Award className={`h-4 w-4 ${iconColor}`} />
    case "trophy":
      return <Trophy className={`h-4 w-4 ${iconColor}`} />
    case "star":
      return <Star className={`h-4 w-4 ${iconColor}`} />
    case "crown":
      return <Crown className={`h-4 w-4 ${iconColor}`} />
    default:
      return <Award className={`h-4 w-4 ${iconColor}`} />
  }
}

function RadarChart({ player1, player2, format }: { player1: any; player2: any; format: Format }) {
  const isBowler = (player: any) => player.role.includes("Bowler")

  const getBattingData = (player: any) => [
    player.stats[format].average,
    player.stats[format].strikeRate / 2, // Scale down for better visualization
    player.stats[format].hundreds * 2, // Scale up for better visualization
    player.stats[format].chaseAvg,
    player.stats[format].boundaryPct * 3, // Scale up for better visualization
  ]

  const getBowlingData = (player: any) => [
    Math.max(0, 100 - player.stats[format].economy * 10), // Invert economy (lower is better)
    player.stats[format].wickets / 2, // Scale down for better visualization
    player.stats[format].dotPct,
    player.stats[format].deathPerf,
    Math.max(0, 50 - player.stats[format].average / 2), // Bowling average (lower is better)
  ]

  const battingLabels = ["Average", "Strike Rate", "Centuries", "Chase Avg", "Boundary %"]
  const bowlingLabels = ["Economy", "Wickets", "Dot Ball %", "Death Overs", "Bowling Avg"]

  const labels = isBowler(player1) || isBowler(player2) ? bowlingLabels : battingLabels

  const data = {
    labels,
    datasets: [
      {
        label: player1.name,
        data: isBowler(player1) ? getBowlingData(player1) : getBattingData(player1),
        borderColor: "rgba(34, 197, 94, 1)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 197, 94, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(34, 197, 94, 1)",
      },
      {
        label: player2.name,
        data: isBowler(player2) ? getBowlingData(player2) : getBattingData(player2),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(59, 130, 246, 1)",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
        pointLabels: {
          color: "white",
          font: {
            size: 12,
          },
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          backdropColor: "transparent",
        },
        beginAtZero: true,
        max: 100,
      },
    },
  }

  return (
    <div className="h-80 w-full">
      <Radar data={data} options={options} />
    </div>
  )
}

function StatBarChart({ player1, player2, format }: { player1: any; player2: any; format: Format }) {
  const isBowler = (player: any) => player.role.includes("Bowler")

  const getBattingStats = (player: any) => ({
    labels: ["Average", "Strike Rate", "Centuries", "Chase Avg", "Boundary %"],
    values: [
      player.stats[format].average,
      player.stats[format].strikeRate,
      player.stats[format].hundreds,
      player.stats[format].chaseAvg,
      player.stats[format].boundaryPct,
    ],
  })

  const getBowlingStats = (player: any) => ({
    labels: ["Wickets", "Economy", "Dot Ball %", "Death Overs", "Bowling Avg"],
    values: [
      player.stats[format].wickets,
      player.stats[format].economy,
      player.stats[format].dotPct,
      player.stats[format].deathPerf,
      player.stats[format].average,
    ],
  })

  const stats = isBowler(player1) || isBowler(player2) ? getBowlingStats(player1) : getBattingStats(player1)
  const stats2 = isBowler(player1) || isBowler(player2) ? getBowlingStats(player2) : getBattingStats(player2)

  const data = {
    labels: stats.labels,
    datasets: [
      {
        label: player1.name,
        data: stats.values,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: player2.name,
        data: stats2.values,
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="h-80 w-full">
      <Bar data={data} options={options} />
    </div>
  )
}

export default function PlayerComparePage() {
  const [format, setFormat] = useState<Format>("ODI")
  const [leftPlayerId, setLeftPlayerId] = useState(allPlayers[0].id)
  const [rightPlayerId, setRightPlayerId] = useState(allPlayers[1].id)
  const [chartType, setChartType] = useState<"radar" | "bar">("radar")
  const [fanVote, setFanVote] = useState<{ [key: string]: number }>({
    [allPlayers[0].id]: 60,
    [allPlayers[1].id]: 40,
  })

  const leftPlayer = allPlayers.find((p) => p.id === leftPlayerId) || allPlayers[0]
  const rightPlayer = allPlayers.find((p) => p.id === rightPlayerId) || allPlayers[1]

  // AI Insights generation
  const generateAIInsights = () => {
    const insights = []

    if (leftPlayer.stats[format].strikeRate > rightPlayer.stats[format].strikeRate) {
      insights.push(
        `${leftPlayer.name} has a higher strike rate (${leftPlayer.stats[format].strikeRate}) compared to ${rightPlayer.name} (${rightPlayer.stats[format].strikeRate}), making them more aggressive.`,
      )
    } else {
      insights.push(
        `${rightPlayer.name} has a higher strike rate (${rightPlayer.stats[format].strikeRate}) compared to ${leftPlayer.name} (${leftPlayer.stats[format].strikeRate}), showing more aggressive intent.`,
      )
    }

    if (leftPlayer.stats[format].average > rightPlayer.stats[format].average) {
      insights.push(
        `${leftPlayer.name} is more consistent with an average of ${leftPlayer.stats[format].average} vs ${rightPlayer.name}'s ${rightPlayer.stats[format].average}.`,
      )
    } else {
      insights.push(
        `${rightPlayer.name} shows better consistency with an average of ${rightPlayer.stats[format].average} compared to ${leftPlayer.name}'s ${leftPlayer.stats[format].average}.`,
      )
    }

    if (leftPlayer.stats[format].chaseAvg > rightPlayer.stats[format].chaseAvg) {
      insights.push(
        `${leftPlayer.name} excels in chase situations with an average of ${leftPlayer.stats[format].chaseAvg}, while ${rightPlayer.name} averages ${rightPlayer.stats[format].chaseAvg}.`,
      )
    }

    return insights
  }

  const handleVote = (playerId: number) => {
    const otherPlayerId = playerId === leftPlayerId ? rightPlayerId : leftPlayerId
    setFanVote({
      [playerId]: Math.min(fanVote[playerId] + 1, 95),
      [otherPlayerId]: Math.max(fanVote[otherPlayerId] - 1, 5),
    })
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
                <Users className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Player Comparison
                </h1>
                <p className="text-xs text-white/60">Compare cricket players side-by-side</p>
              </div>
            </div>
            <NavigationMenu currentPage="players" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
        {/* Player Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Select Player 1</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={leftPlayerId.toString()}
                onValueChange={(value) => setLeftPlayerId(Number.parseInt(value))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {allPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()} className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <span>{player.flag}</span>
                        <span>{player.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Select Player 2</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={rightPlayerId.toString()}
                onValueChange={(value) => setRightPlayerId(Number.parseInt(value))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {allPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()} className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <span>{player.flag}</span>
                        <span>{player.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Player Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {[leftPlayer, rightPlayer].map((player, index) => (
            <Card
              key={player.id}
              className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
            >
              <CardHeader className="text-center">
                <div className="flex flex-col items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="w-24 h-24 ring-4 ring-gradient-to-r from-green-400 to-blue-500 hover:scale-110 transition-transform duration-300">
                          <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                          <AvatarFallback className="text-2xl">{player.flag}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{player.country} Cricket Team</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div>
                    <CardTitle className="text-white text-xl mb-2">{player.name}</CardTitle>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-3xl">{player.flag}</span>
                      <span className="text-white/80 text-sm">{player.role}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {player.badges.map((badge, badgeIndex) => (
                        <Badge
                          key={badgeIndex}
                          className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs hover:scale-105 transition-transform duration-200"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Format and Chart Type Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
          <Tabs value={format} onValueChange={(v) => setFormat(v as Format)} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 bg-white/10 border-white/20">
              {formatList.map((f) => (
                <TabsTrigger
                  key={f}
                  value={f}
                  className="capitalize text-white/80 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-300"
                >
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant={chartType === "radar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("radar")}
              className={
                chartType === "radar"
                  ? "bg-gradient-to-r from-green-500 to-blue-600 text-white border-0"
                  : "border-white/20 text-white hover:bg-white/10 bg-transparent"
              }
            >
              <Activity className="w-4 h-4 mr-2" />
              Radar
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className={
                chartType === "bar"
                  ? "bg-gradient-to-r from-green-500 to-blue-600 text-white border-0"
                  : "border-white/20 text-white hover:bg-white/10 bg-transparent"
              }
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Bar Chart
            </Button>
          </div>
        </div>

        {/* Stats Comparison Chart */}
        <Card className="bg-white/10 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center gap-2">
              <TrendingUp className="text-blue-400" />
              {format} Statistics Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartType === "radar" ? (
              <RadarChart player1={leftPlayer} player2={rightPlayer} format={format} />
            ) : (
              <StatBarChart player1={leftPlayer} player2={rightPlayer} format={format} />
            )}
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <Card className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-500/30 text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="text-yellow-400" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-3">
              {generateAIInsights().map((insight, idx) => (
                <li key={idx} className="text-white/90 leading-relaxed">
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Iconic Moments Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[leftPlayer, rightPlayer].map((player) => (
            <Card key={player.id} className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Calendar className="text-pink-400" />
                  {player.name}'s Career Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400"></div>
                  <div className="space-y-4">
                    {player.moments.map((moment, idx) => (
                      <div key={idx} className="relative flex items-start gap-4 pl-8">
                        <div className="absolute -left-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                          {renderMomentIcon(moment.icon, "text-white")}
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg flex-1 hover:bg-white/10 transition-colors duration-200 min-h-[60px] flex flex-col justify-center">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <span className="text-white font-semibold">{moment.year}</span>
                            <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-white/20 w-fit">
                              {moment.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fan Verdict Section */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white justify-center">
              <Users className="text-green-400" />
              Fan Verdict
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-white/80 mb-4">Who would you pick for a final over chase?</p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => handleVote(leftPlayer.id)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg border-0"
                  >
                    {leftPlayer.name}
                  </Button>
                  <Button
                    onClick={() => handleVote(rightPlayer.id)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300 hover:shadow-lg border-0"
                  >
                    {rightPlayer.name}
                  </Button>
                </div>
              </div>

              {/* Poll Results */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={leftPlayer.avatar || "/placeholder.svg"} alt={leftPlayer.name} />
                    <AvatarFallback>{leftPlayer.flag}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-white/80 mb-1">
                      <span>{leftPlayer.name}</span>
                      <span>{fanVote[leftPlayer.id]}%</span>
                    </div>
                    <Progress value={fanVote[leftPlayer.id]} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={rightPlayer.avatar || "/placeholder.svg"} alt={rightPlayer.name} />
                    <AvatarFallback>{rightPlayer.flag}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-white/80 mb-1">
                      <span>{rightPlayer.name}</span>
                      <span>{fanVote[rightPlayer.id]}%</span>
                    </div>
                    <Progress value={fanVote[rightPlayer.id]} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFanVote({ [leftPlayer.id]: 50, [rightPlayer.id]: 50 })}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Poll
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
