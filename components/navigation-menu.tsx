"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Home, Users, Trophy, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

interface NavigationMenuProps {
  currentPage?: string
}

export function NavigationMenu({ currentPage }: NavigationMenuProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: "Dashboard", href: "/", icon: Home, key: "dashboard" },
    { label: "Matches", href: "/matches", icon: Trophy, key: "matches" },
    { label: "Players", href: "/player/1", icon: Users, key: "players" },
    { label: "Teams", href: "/teams/1", icon: BarChart3, key: "teams" },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.key
          return (
            <Button
              key={item.key}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.href)}
              className={`
                transition-all duration-300 hover:scale-105
                ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg"
                    : "text-white hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          )
        })}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white/10 backdrop-blur-lg border-white/20 text-white">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.key
              return (
                <DropdownMenuItem
                  key={item.key}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-green-500/20 to-blue-600/20 text-white"
                        : "hover:bg-white/10 text-white/80 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
