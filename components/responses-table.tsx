"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ParsedRow } from "@/lib/data-parser"
import { ChevronDown } from "lucide-react"

interface ResponsesTableProps {
  rows: ParsedRow[]
  headerMapping: Record<string, string>
}

export const ResponsesTable = ({ rows, headerMapping }: ResponsesTableProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const displayRows = rows.slice(0, 20)

  const formatValue = (value: any): string => {
    if (value instanceof Date) {
      return value.toLocaleString()
    }
    return String(value || "N/A")
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg">Recent Responses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Profession</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Q4</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayRows.map((row, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border-b border-border/50 hover:bg-muted/50 transition-colors ${
                      idx % 2 === 0 ? "bg-card/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-foreground">{formatValue(row[headerMapping["Name"] || "Name"])}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {formatValue(row[headerMapping["Profession"] || "Profession"])}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{formatValue(row[headerMapping["Q4"] || "Q4"])}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {formatValue(row[headerMapping["Timestamp"] || "Timestamp"])}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === idx ? null : idx)}>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedId === idx ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Expanded Row Details */}
        <AnimatePresence>
          {expandedId !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(displayRows[expandedId]).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{key}</p>
                    <p className="text-sm text-foreground mt-1">{formatValue(value)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
