"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, RotateCw } from "lucide-react"

interface NavbarProps {
  onRefresh: () => void
  lastUpdated: Date | null
  isLoading: boolean
}

export const Navbar = ({ onRefresh, lastUpdated, isLoading }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "Never"
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-foreground">Survey Insights</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Updated: {formatTime(lastUpdated)}</div>

          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="gap-2 bg-transparent">
            <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2 bg-transparent">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
