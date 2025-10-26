"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { OverviewCards } from "@/components/overview-cards"
import { Filters } from "@/components/filters"
import { ChartsSection } from "@/components/charts-section"
import { ResponsesTable } from "@/components/responses-table"
import { useSurveyData } from "@/hooks/use-survey-data"
import type { ParsedRow } from "@/lib/data-parser"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Dashboard() {
  const { data, loading, error, lastUpdated, refetch } = useSurveyData(true, 30000)
  const [filteredRows, setFilteredRows] = useState<ParsedRow[]>([])

  const displayRows = filteredRows.length > 0 ? filteredRows : data?.rows || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar onRefresh={refetch} lastUpdated={lastUpdated} isLoading={loading} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Loading State */}
        {loading && !data && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading survey data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Data Warnings */}
        {data?.warnings.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{data.warnings.join(", ")}</AlertDescription>
          </Alert>
        )}

        {/* Dashboard Content */}
        {data && data.rows.length > 0 && (
          <>
            <OverviewCards rows={displayRows} headerMapping={data.headerMapping} lastUpdated={lastUpdated} />
            <Filters rows={data.rows} headerMapping={data.headerMapping} onFilterChange={setFilteredRows} />
            <ChartsSection rows={displayRows} headerMapping={data.headerMapping} />
            <ResponsesTable rows={displayRows} headerMapping={data.headerMapping} />
          </>
        )}

        {data && data.rows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No survey responses found.</p>
          </div>
        )}
      </main>
    </div>
  )
}
