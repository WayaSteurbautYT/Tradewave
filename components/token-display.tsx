"use client"

import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenDisplayProps {
  tokens: number
}

export function TokenDisplay({ tokens }: TokenDisplayProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-teal-800 bg-teal-900/30 p-2 shadow-sm">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <Coins className="h-4 w-4 text-teal-400" />
        <span className="text-teal-300">{tokens.toLocaleString()} WaveTokens</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6 text-teal-400 hover:bg-teal-800 hover:text-teal-300"
            >
              <span className="sr-only">Token Info</span>
              <span className="text-xs font-bold">?</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">
              WaveTokens are used to watch content, download projects, and request custom work. You must maintain at
              least 10% of your tokens to stay active on the platform.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
