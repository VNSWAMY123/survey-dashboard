"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ParsedRow } from "@/lib/data-parser"
import { getQuestionDistribution, getProfessionDistribution, getResponsesOverTime } from "@/lib/data-utils"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ChartsSectionProps {
  rows: ParsedRow[]
  headerMapping: Record<string, string>
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

export const ChartsSection = ({ rows, headerMapping }: ChartsSectionProps) => {
  const [timeAggregation, setTimeAggregation] = useState<"daily" | "weekly">("daily")

  const q4Data = getQuestionDistribution(rows, headerMapping["Q4"] || "Q4")
  const professionData = getProfessionDistribution(rows, headerMapping["Profession"] || "Profession")
  const timeData = getResponsesOverTime(rows, headerMapping["Timestamp"] || "Timestamp")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Q4 Distribution */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Frequency Distribution (Q4)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={q4Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Profession Distribution */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Profession Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={professionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {professionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                labelStyle={{ color: "var(--foreground)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Responses Over Time */}
      <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Responses Over Time</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeAggregation === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeAggregation("daily")}
            >
              Daily
            </Button>
            <Button
              variant={timeAggregation === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeAggregation("weekly")}
            >
              Weekly
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-2)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
