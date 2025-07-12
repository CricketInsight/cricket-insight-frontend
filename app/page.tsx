"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  Search,
  Filter,
  Star,
  Award,
  Calendar,
  MapPin,
  Zap,
  Activity,
  Globe,
  ArrowUp,
  Menu,
} from "lucide-react"
import { NavigationMenu } from "@/components/navigation-menu"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

const matchData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Wins",
      data: [8, 6, 9, 7, 10, 5],
      backgroundColor: "rgba(34, 197, 94, 0.8)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    },
    {
      label: "Losses",
      data: [2, 4, 1, 3, 0, 5],
      backgroundColor: "rgba(239, 68, 68, 0.8)",
      borderColor: "rgba(239, 68, 68, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}

const playerPerformanceData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Runs",
      data: [450, 380, 520, 410, 600, 480],
      borderColor: "rgba(59, 130, 246, 1)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "rgba(59, 130, 246, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
    {
      label: "Wickets",
      data: [12, 8, 15, 10, 18, 14],
      borderColor: "rgba(245, 158, 11, 1)",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "rgba(245, 158, 11, 1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
}

const formatDistributionData = {
  labels: ["Test", "ODI", "T20"],
  datasets: [
    {
      data: [35, 40, 25],
      backgroundColor: ["rgba(139, 92, 246, 0.8)", "rgba(6, 182, 212, 0.8)", "rgba(245, 158, 11, 0.8)"],
      borderColor: ["rgba(139, 92, 246, 1)", "rgba(6, 182, 212, 1)", "rgba(245, 158, 11, 1)"],
      borderWidth: 2,
      hoverOffset: 10,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "rgba(255, 255, 255, 0.8)",
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "rgba(255, 255, 255, 1)",
      bodyColor: "rgba(255, 255, 255, 0.8)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          size: 10,
        },
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
    y: {
      ticks: {
        color: "rgba(255, 255, 255, 0.7)",
        font: {
          size: 10,
        },
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
  },
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "rgba(255, 255, 255, 0.8)",
        font: {
          size: 10,
        },
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "rgba(255, 255, 255, 1)",
      bodyColor: "rgba(255, 255, 255, 0.8)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 2000,
    easing: "easeInOutQuart",
  },
}

const topPlayers = [
  {
    id: 1,
    name: "Virat Kohli",
    country: "India",
    role: "Batsman",
    runs: 12169,
    average: 59.07,
    centuries: 43,
    rating: 890,
    image: "/placeholder.svg?height=40&width=40",
    trend: "up",
  },
  {
    id: 2,
    name: "Babar Azam",
    country: "Pakistan",
    role: "Batsman",
    runs: 4442,
    average: 56.95,
    centuries: 17,
    rating: 865,
    image: "/placeholder.svg?height=40&width=40",
    trend: "up",
  },
  {
    id: 3,
    name: "Kane Williamson",
    country: "New Zealand",
    role: "Batsman",
    runs: 6173,
    average: 47.48,
    centuries: 24,
    rating: 848,
    image: "/placeholder.svg?height=40&width=40",
    trend: "down",
  },
  {
    id: 4,
    name: "Pat Cummins",
    country: "Australia",
    role: "Bowler",
    wickets: 188,
    average: 22.55,
    economy: 3.26,
    rating: 825,
    image: "/placeholder.svg?height=40&width=40",
    trend: "up",
  },
  {
    id: 5,
    name: "Jasprit Bumrah",
    country: "India",
    role: "Bowler",
    wickets: 128,
    average: 20.06,
    economy: 4.63,
    rating: 820,
    image: "/placeholder.svg?height=40&width=40",
    trend: "up",
  },
]

const recentMatches = [
  {
    id: 1,
    team1: "India",
    team2: "Australia",
    result: "India won by 6 wickets",
    date: "2024-01-15",
    venue: "Melbourne Cricket Ground",
    format: "Test",
    status: "completed",
  },
  {
    id: 2,
    team1: "England",
    team2: "Pakistan",
    result: "England won by 74 runs",
    date: "2024-01-12",
    venue: "Lord's Cricket Ground",
    format: "ODI",
    status: "completed",
  },
  {
    id: 3,
    team1: "South Africa",
    team2: "New Zealand",
    result: "South Africa won by 5 runs",
    date: "2024-01-10",
    venue: "Cape Town",
    format: "T20",
    status: "completed",
  },
]

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

export default function CricketInsights() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const filteredPlayers = topPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const navItems = [
    { name: "Dashboard", href: "#dashboard" },
    { name: "Players", href: "/player/1" },
    { name: "Teams", href: "/teams/1" },
    { name: "Matches", href: "/matches" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className={`flex items-center space-x-2 sm:space-x-3 transition-all duration-1000 ${isLoaded ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-pulse" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cricket Insights
              </h1>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu currentPage="dashboard" />

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900/95 backdrop-blur-lg border-white/20">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-white/80 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {[
            { title: "Total Matches", value: 2847, icon: Trophy, color: "from-blue-500 to-cyan-500", change: "+12%" },
            {
              title: "Active Players",
              value: 1234,
              icon: Users,
              color: "from-green-500 to-emerald-500",
              change: "+5%",
            },
            { title: "Total Runs", value: 456789, icon: Target, color: "from-purple-500 to-pink-500", change: "+8%" },
            {
              title: "Win Rate",
              value: 73.2,
              icon: TrendingUp,
              color: "from-orange-500 to-red-500",
              change: "+2.1%",
              suffix: "%",
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className={`bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl group ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-white/80 leading-tight">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg border-white/20 p-1 h-auto">
            {["dashboard", "players", "teams", "matches"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70 hover:text-white transition-all duration-300 hover:scale-105 capitalize text-xs sm:text-sm py-2"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    <span>Match Results Trend</span>
                  </CardTitle>
                  <CardDescription className="text-white/60 text-xs sm:text-sm">
                    Monthly wins vs losses comparison
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="h-[200px] sm:h-[300px]">
                    <Bar data={matchData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    <span>Player Performance</span>
                  </CardTitle>
                  <CardDescription className="text-white/60 text-xs sm:text-sm">
                    Runs and wickets over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="h-[200px] sm:h-[300px]">
                    <Line data={playerPerformanceData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                    <span>Format Distribution</span>
                  </CardTitle>
                  <CardDescription className="text-white/60 text-xs sm:text-sm">Matches by format</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="h-[200px] sm:h-[250px]">
                    <Doughnut data={formatDistributionData} options={pieChartOptions} />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-gold-400" />
                    <span>Recent Matches</span>
                  </CardTitle>
                  <CardDescription className="text-white/60 text-xs sm:text-sm">Latest match results</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {recentMatches.map((match, index) => (
                      <div
                        key={match.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg group space-y-2 sm:space-y-0 ${
                          isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                        }`}
                        style={{ transitionDelay: `${index * 200}ms` }}
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300 text-sm sm:text-base">
                              {match.team1}
                            </span>
                            <span className="text-white/60 text-sm">vs</span>
                            <span className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 text-sm sm:text-base">
                              {match.team2}
                            </span>
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs">
                              {match.format}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-green-400 font-medium mb-2 group-hover:text-green-300 transition-colors duration-300">
                            {match.result}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-white/60">
                            <div className="flex items-center space-x-1 group-hover:text-white/80 transition-colors duration-300">
                              <Calendar className="h-3 w-3" />
                              <span>{match.date}</span>
                            </div>
                            <div className="flex items-center space-x-1 group-hover:text-white/80 transition-colors duration-300">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-[150px] sm:max-w-none">{match.venue}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 bg-transparent text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0"
                          onClick={() => (window.location.href = "/matches")}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span>Player Statistics</span>
                    </CardTitle>
                    <CardDescription className="text-white/60 text-xs sm:text-sm">
                      Top performing players across all formats
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative group flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60 group-hover:text-white transition-colors duration-300" />
                      <Input
                        placeholder="Search players..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 transition-all duration-300 text-sm"
                      />
                    </div>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger className="w-full sm:w-32 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-lg border-white/20">
                        <SelectItem value="all">All Formats</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="odi">ODI</SelectItem>
                        <SelectItem value="t20">T20</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value="all" onValueChange={() => {}}>
                      <SelectTrigger className="w-full sm:w-40 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm">
                        <Users className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Teams" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-lg border-white/20">
                        <SelectItem value="all">All Teams</SelectItem>
                        <SelectItem value="india">🇮🇳 India</SelectItem>
                        <SelectItem value="australia">🇦🇺 Australia</SelectItem>
                        <SelectItem value="england">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</SelectItem>
                        <SelectItem value="pakistan">🇵🇰 Pakistan</SelectItem>
                        <SelectItem value="south-africa">🇿🇦 South Africa</SelectItem>
                        <SelectItem value="new-zealand">🇳🇿 New Zealand</SelectItem>
                        <SelectItem value="west-indies">🇯🇲 West Indies</SelectItem>
                        <SelectItem value="sri-lanka">🇱🇰 Sri Lanka</SelectItem>
                        <SelectItem value="bangladesh">🇧🇩 Bangladesh</SelectItem>
                        <SelectItem value="afghanistan">🇦🇫 Afghanistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {filteredPlayers.map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group ${
                        isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg sm:text-2xl font-bold text-white/60 group-hover:text-white transition-colors duration-300">
                          #{index + 1}
                        </span>
                        <Avatar className="ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 hover:scale-110 h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={player.image || "/placeholder.svg"} alt={player.name} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm">
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="sm:hidden">
                          <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                            {player.name}
                          </h3>
                          <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300">
                            {player.country}
                          </p>
                          <Badge className="mt-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-xs">
                            {player.role}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="hidden sm:block">
                          <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                            {player.name}
                          </h3>
                          <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300">
                            {player.country}
                          </p>
                          <Badge className="mt-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                            {player.role}
                          </Badge>
                        </div>

                        <div className="space-y-1">
                          {player.role === "Batsman" ? (
                            <>
                              <div className="text-xs sm:text-sm text-white/80">
                                <span className="font-medium">Runs:</span> <AnimatedCounter end={player.runs || 0} />
                              </div>
                              <div className="text-xs sm:text-sm text-white/80">
                                <span className="font-medium">Average:</span> {player.average}
                              </div>
                              <div className="text-xs sm:text-sm text-white/80">
                                <span className="font-medium">Centuries:</span> {player.centuries}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs sm:text-sm text-white/80">
                                <span className="font-medium">Wickets:</span> {player.wickets}
                              </div>
                              <div className="text-xs sm:text-sm text-white/80">
                                <span className="font-medium">Average:</span> {player.average}
                              </div>
                              <div className="text-xs sm:text-sm text-white/80">
                                <span className="font-medium">Economy:</span> {player.economy}
                              </div>
                            </>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                            <span className="font-medium text-white/80 text-xs sm:text-sm">Rating</span>
                            {player.trend === "up" ? (
                              <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3 text-green-400" />
                            ) : (
                              <ArrowUp className="h-2 w-2 sm:h-3 sm:w-3 text-red-400 rotate-180" />
                            )}
                          </div>
                          <div className="text-lg sm:text-2xl font-bold text-white">
                            <AnimatedCounter end={player.rating} />
                          </div>
                          <Progress value={(player.rating / 1000) * 100} className="mt-2 bg-white/20" />
                        </div>

                        <div className="flex items-center justify-start sm:justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 bg-transparent text-xs w-full sm:w-auto"
                            onClick={() => (window.location.href = `/player/${player.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {["India", "Australia", "England", "Pakistan", "South Africa", "New Zealand"].map((team, index) => (
                <Card
                  key={team}
                  className={`bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl group cursor-pointer ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => (window.location.href = `/teams/${index + 1}`)}
                >
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2 text-white group-hover:text-green-400 transition-colors duration-300 text-sm sm:text-base">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={team} />
                          <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-xs">
                            {team.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{team}</span>
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between group-hover:text-white transition-colors duration-300">
                        <span className="text-xs sm:text-sm text-white/60">Matches Won</span>
                        <span className="font-semibold text-white text-sm sm:text-base">
                          <AnimatedCounter end={Math.floor(Math.random() * 100) + 50} />
                        </span>
                      </div>
                      <div className="flex justify-between group-hover:text-white transition-colors duration-300">
                        <span className="text-xs sm:text-sm text-white/60">Win Rate</span>
                        <span className="font-semibold text-white text-sm sm:text-base">
                          {(Math.random() * 30 + 60).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between group-hover:text-white transition-colors duration-300">
                        <span className="text-xs sm:text-sm text-white/60">Ranking Points</span>
                        <span className="font-semibold text-white text-sm sm:text-base">
                          <AnimatedCounter end={Math.floor(Math.random() * 200) + 800} />
                        </span>
                      </div>
                      <Progress
                        value={Math.random() * 40 + 60}
                        className="mt-3 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 bg-transparent text-xs opacity-0 group-hover:opacity-100"
                      >
                        View Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4 sm:space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-500">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-white flex items-center space-x-2 text-sm sm:text-base">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-gold-400" />
                  <span>Match Schedule & Results</span>
                </CardTitle>
                <CardDescription className="text-white/60 text-xs sm:text-sm">
                  Upcoming and recent cricket matches
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center space-x-2 text-white">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span>Recent Results</span>
                    </h3>
                    <div className="space-y-3">
                      {recentMatches.map((match, index) => (
                        <div
                          key={match.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl group space-y-2 sm:space-y-0 ${
                            isLoaded ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                          }`}
                          style={{ transitionDelay: `${index * 200}ms` }}
                        >
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-semibold text-sm sm:text-lg text-white group-hover:text-green-400 transition-colors duration-300">
                                {match.team1}
                              </span>
                              <span className="text-white/60 text-sm">vs</span>
                              <span className="font-semibold text-sm sm:text-lg text-white group-hover:text-blue-400 transition-colors duration-300">
                                {match.team2}
                              </span>
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-xs">
                                {match.format}
                              </Badge>
                            </div>
                            <p className="text-green-400 font-medium mb-2 group-hover:text-green-300 transition-colors duration-300 text-xs sm:text-sm">
                              {match.result}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/60">
                              <div className="flex items-center space-x-1 group-hover:text-white/80 transition-colors duration-300">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>{new Date(match.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1 group-hover:text-white/80 transition-colors duration-300">
                                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="truncate max-w-[200px] sm:max-w-none">{match.venue}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 bg-transparent text-xs sm:text-sm w-full sm:w-auto mt-2 sm:mt-0"
                            onClick={() => (window.location.href = "/matches")}
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 bg-transparent"
                      onClick={() => (window.location.href = "/matches")}
                    >
                      <Trophy className="h-5 w-5 mr-2" />
                      View All Matches
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
