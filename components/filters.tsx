"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ParsedRow } from "@/lib/data-parser"
import { X } from "lucide-react"

interface FiltersProps {
  rows: ParsedRow[]
  headerMapping: Record<string, string>
  onFilterChange: (filtered: ParsedRow[]) => void
}

export const Filters = ({ rows, headerMapping, onFilterChange }: FiltersProps) => {
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })

  const professions = Array.from(
    new Set(rows.map((r) => r[headerMapping["Profession"] || "Profession"] as string).filter(Boolean)),
  ).sort()

  const applyFilters = () => {
    let filtered = rows

    if (selectedProfessions.length > 0) {
      filtered = filtered.filter((r) =>
        selectedProfessions.includes(r[headerMapping["Profession"] || "Profession"] as string),
      )
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((r) => {
        const ts = r[headerMapping["Timestamp"] || "Timestamp"]
        if (!(ts instanceof Date)) return true

        if (dateRange.start && ts < new Date(dateRange.start)) return false
        if (dateRange.end && ts > new Date(dateRange.end)) return false
        return true
      })
    }

    onFilterChange(filtered)
  }

  const resetFilters = () => {
    setSelectedProfessions([])
    setDateRange({ start: "", end: "" })
    onFilterChange(rows)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profession Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Profession</label>
            <div className="flex flex-wrap gap-2">
              {professions.map((prof) => (
                <Button
                  key={prof}
                  variant={selectedProfessions.includes(prof) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedProfessions((prev) =>
                      prev.includes(prof) ? prev.filter((p) => p !== prof) : [...prev, prof],
                    )
                  }}
                >
                  {prof}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={applyFilters} className="gap-2">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
