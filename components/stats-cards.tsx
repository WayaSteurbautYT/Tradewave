import { ArrowDownIcon, ArrowUpIcon, DollarSign, Eye, FileCode, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-[#0f172a] border-teal-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-300">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">$4,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-teal-400 flex items-center">
              +20.1% <ArrowUpIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#0f172a] border-teal-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-300">Content Views</CardTitle>
          <Eye className="h-4 w-4 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">+12,234</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-teal-400 flex items-center">
              +15.3% <ArrowUpIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#0f172a] border-teal-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-300">Active Projects</CardTitle>
          <FileCode className="h-4 w-4 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">7</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-teal-400 flex items-center">
              +2 <ArrowUpIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            new this week
          </p>
        </CardContent>
      </Card>
      <Card className="bg-[#0f172a] border-teal-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-teal-300">WaveRiders Growth</CardTitle>
          <Users className="h-4 w-4 text-teal-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">+573</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-400 flex items-center">
              -2% <ArrowDownIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
