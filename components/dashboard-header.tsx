import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <div className="border-b border-teal-800">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-teal-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-8 bg-teal-900/30 border-teal-800 placeholder:text-teal-600 focus-visible:ring-teal-500"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-teal-800 text-teal-400 hover:bg-teal-900 hover:text-teal-300"
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
