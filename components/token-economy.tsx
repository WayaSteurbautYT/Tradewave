"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function TokenEconomy() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const data = [
    { name: "Mon", earned: 120, spent: 50 },
    { name: "Tue", earned: 80, spent: 30 },
    { name: "Wed", earned: 200, spent: 150 },
    { name: "Thu", earned: 150, spent: 70 },
    { name: "Fri", earned: 300, spent: 200 },
    { name: "Sat", earned: 250, spent: 100 },
    { name: "Sun", earned: 180, spent: 120 },
  ]

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center text-teal-400">Loading chart...</div>
  }

  return (
    <ChartContainer className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e4b5a" />
          <XAxis dataKey="name" stroke="#7dd3fc" />
          <YAxis stroke="#7dd3fc" />
          <Tooltip
            content={(props) => {
              if (!props || !props.active || !props.payload || !props.payload.length) {
                return null
              }

              const payload = props.payload
              const name = payload[0]?.payload?.name || ""

              return (
                <ChartTooltip>
                  <ChartTooltipContent className="mb-2 bg-teal-900 border-teal-700">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-teal-300">{name}</span>
                      <span className="flex items-center gap-1 text-xs text-teal-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        Earned: {payload[0]?.value || 0} tokens
                      </span>
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Spent: {payload[1]?.value || 0} tokens
                      </span>
                    </div>
                  </ChartTooltipContent>
                </ChartTooltip>
              )
            }}
          />
          <Legend />
          <Bar dataKey="earned" fill="#14b8a6" name="Tokens Earned" />
          <Bar dataKey="spent" fill="#f87171" name="Tokens Spent" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
