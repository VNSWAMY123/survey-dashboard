"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ParsedRow } from "@/lib/data-parser"
import { getTopProfession, calculateSatisfaction } from "@/lib/data-utils"
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react"

interface OverviewCardsProps {
  rows: ParsedRow[]
  headerMapping: Record<string, string>
  lastUpdated: Date | null
}

const StatCard = ({ icon: Icon, title, value, subtitle }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  </motion.div>
)

export const OverviewCards = ({ rows, headerMapping, lastUpdated }: OverviewCardsProps) => {
  const totalResponses = rows.length
  const topProfession = getTopProfession(rows, headerMapping["Profession"] || "Profession")
  const satisfaction = calculateSatisfaction(rows, headerMapping["Q10"], headerMapping["Q11"])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={Users} title="Total Responses" value={totalResponses} subtitle="Survey submissions" />
      <StatCard icon={Briefcase} title="Top Profession" value={topProfession} subtitle="Most common role" />
      <StatCard icon={TrendingUp} title="Satisfaction" value={`${satisfaction}%`} subtitle="Positive responses" />
      <StatCard
        icon={Clock}
        title="Last Updated"
        value={lastUpdated ? lastUpdated.toLocaleTimeString() : "N/A"}
        subtitle="Real-time data"
      />
    </div>
  )
}
