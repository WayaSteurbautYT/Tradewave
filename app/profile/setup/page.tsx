"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"

export default function ProfileSetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("tradewave_role"))
    }
  }, [])

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Complete Your Profile</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1">Verification</h2>
            <p className="text-muted-foreground text-sm mb-2">Verification is required to access all features. (Coming soon)</p>
            <Button variant="outline" disabled>Start Verification</Button>
          </div>
          <div>
            <h2 className="font-semibold mb-1">Payment Details</h2>
            <p className="text-muted-foreground text-sm mb-2">Add your payment details to receive payouts or buy credits. (Coming soon)</p>
            <Button variant="outline" disabled>Add Payment Details</Button>
          </div>
          <div>
            <h2 className="font-semibold mb-1">Your Role</h2>
            <p className="text-muted-foreground text-sm mb-2">You are currently signed up as: <span className="font-bold">{role}</span></p>
            <Button variant="outline" onClick={() => router.push("/role")}>Change Role</Button>
          </div>
        </div>
        <Button className="w-full mt-4" onClick={() => router.push("/dashboard")}>Finish & Go to Dashboard</Button>
      </div>
    </div>
  )
} 