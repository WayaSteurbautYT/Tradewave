"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"

const TOKEN_PACKAGES = [
  { tokens: 100, price: 5 },
  { tokens: 500, price: 20 },
  { tokens: 1000, price: 35 },
]

export default function BuyTokensPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBuy = async (tokens: number, price: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens, price, uid: user?.uid }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError("Could not start checkout. Please try again.")
      }
    } catch (e) {
      setError("Error connecting to payment provider.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Buy Tokens</h1>
        <p className="text-muted-foreground text-center mb-4">Select a package to purchase tokens using Stripe.</p>
        <div className="flex flex-col gap-4">
          {TOKEN_PACKAGES.map(pkg => (
            <Button
              key={pkg.tokens}
              className="w-full"
              disabled={loading}
              onClick={() => handleBuy(pkg.tokens, pkg.price)}
            >
              {pkg.tokens} Tokens - ${pkg.price}
            </Button>
          ))}
        </div>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </div>
    </div>
  )
} 