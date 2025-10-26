// Utility functions for data analysis
import type { ParsedRow } from "./data-parser"

export const getTopProfession = (rows: ParsedRow[], professionField: string): string => {
  const professions = rows.map((r) => r[professionField] as string).filter(Boolean)
  const counts = professions.reduce(
    (acc, prof) => {
      acc[prof] = (acc[prof] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
}

export const getProfessionDistribution = (rows: ParsedRow[], professionField: string) => {
  const professions = rows.map((r) => r[professionField] as string).filter(Boolean)
  const counts = professions.reduce(
    (acc, prof) => {
      acc[prof] = (acc[prof] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export const getQuestionDistribution = (rows: ParsedRow[], questionField: string) => {
  const answers = rows.map((r) => r[questionField] as string).filter(Boolean)
  const counts = answers.reduce(
    (acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

export const getResponsesOverTime = (rows: ParsedRow[], timestampField: string) => {
  const dateMap = new Map<string, number>()

  rows.forEach((row) => {
    const ts = row[timestampField]
    if (ts instanceof Date) {
      const dateStr = ts.toISOString().split("T")[0]
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1)
    }
  })

  return Array.from(dateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))
}

export const calculateSatisfaction = (rows: ParsedRow[], q10Field?: string, q11Field?: string): number => {
  let yesCount = 0
  let totalCount = 0

  rows.forEach((row) => {
    if (q10Field && row[q10Field]) {
      const val = (row[q10Field] as string).toLowerCase()
      if (val === "yes" || val === "y") yesCount++
      totalCount++
    }
    if (q11Field && row[q11Field]) {
      const val = (row[q11Field] as string).toLowerCase()
      if (val === "no" || val === "n") yesCount++
      totalCount++
    }
  })

  return totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 0
}
