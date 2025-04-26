import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#7d3fc]/20 bg-[#0f172a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f172a]/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-[#7d3fc]">
              TradeWave
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/explore" className="text-[#7d3fc] hover:text-[#7d3fc]/80 transition-colors">
              Explore
            </Link>
            <Link href="/marketplace" className="text-[#7d3fc] hover:text-[#7d3fc]/80 transition-colors">
              Marketplace
            </Link>
            <Link href="/stream" className="text-[#7d3fc] hover:text-[#7d3fc]/80 transition-colors">
              Stream
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search bar can be added here later */}
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" className="text-[#7d3fc] hover:text-[#7d3fc]/80 hover:bg-[#7d3fc]/10" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-[#7d3fc] hover:bg-[#7d3fc]/90 text-white" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 