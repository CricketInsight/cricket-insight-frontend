"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Menu, Home, BarChart3, Users, Trophy, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationMenuProps {
  currentPage?: string
}

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Matches",
    href: "/matches",
    icon: Trophy,
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Shield,
  },
  {
    title: "Players",
    href: "/player/compare",
    icon: Users,
  },
  // {
  //   title: "Insights",
  //   href: "/insights",
  //   icon: BarChart3,
  // },
]

export function NavigationMenu({ currentPage }: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-4">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/20 text-white dark:bg-white/20 dark:text-white light:bg-slate-100 light:text-slate-900"
                  : "text-white/80 hover:text-white hover:bg-white/10 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>



      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10 light:text-slate-900 light:hover:bg-slate-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] bg-slate-900 dark:bg-slate-900 light:bg-white border-slate-800 dark:border-slate-800 light:border-slate-200"
        >
          <div className="flex flex-col space-y-4 mt-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/20 text-white dark:bg-white/20 dark:text-white light:bg-slate-100 light:text-slate-900"
                      : "text-white/80 hover:text-white hover:bg-white/10 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
