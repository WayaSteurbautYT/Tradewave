import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">TradeWave</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Explore
            </Link>
            <Link href="/marketplace" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Marketplace
            </Link>
            <Link href="/streams" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Streams
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
} 