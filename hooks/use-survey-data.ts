"use client"

import { useState, useEffect, useCallback } from "react"
import { parseSheetData, type ParsedData } from "@/lib/data-parser"
import { SHEET_URL, REFRESH_INTERVAL } from "@/lib/config"

export const useSurveyData = (autoRefresh = true, refreshInterval: number = REFRESH_INTERVAL) => {
  const [data, setData] = useState<ParsedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const parsedData = await parseSheetData(SHEET_URL)
      setData(parsedData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      console.error("[v0] Error fetching survey data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchData, autoRefresh, refreshInterval])

  return { data, loading, error, lastUpdated, refetch: fetchData }
}
