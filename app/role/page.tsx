"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

export default function RoleSelectionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!role) return
    localStorage.setItem("tradewave_role", role)
    if (user) {
      setLoading(true)
      // Update user and profile in Firestore
      const userRef = doc(db, "users", user.uid)
      const profileRef = doc(db, "profiles", user.uid)
      await setDoc(userRef, { role }, { merge: true })
      // Create profile if missing
      const profileSnap = await getDoc(profileRef)
      if (!profileSnap.exists()) {
        // Generate username from email or UID
        const username = user.email ? user.email.split("@")[0] : user.uid.slice(0, 8)
        await setDoc(profileRef, {
          uid: user.uid,
          email: user.email || null,
          role,
          username,
          name: user.displayName || username,
          joinDate: new Date().toLocaleString(),
          tokens: 0,
          skills: [],
        })
      } else {
        await setDoc(profileRef, { role }, { merge: true })
      }
      setLoading(false)
      router.push("/profile/setup")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">How do you want to use TradeWave?</h1>
        <p className="text-muted-foreground text-center">
          You can use the platform without a subscription, but if you get hired or use the platform for other projects/videos, a portion of your earned credits will be deducted as a platform fee.
        </p>
        <div className="flex flex-col gap-4">
          <Button
            variant={role === "viewer" ? "default" : "outline"}
            onClick={() => setRole("viewer")}
            className="w-full"
          >
            Viewer / Hirer (Buy credits, hire creators)
          </Button>
          <Button
            variant={role === "creator" ? "default" : "outline"}
            onClick={() => setRole("creator")}
            className="w-full"
          >
            Creator (Upload content, get hired)
          </Button>
        </div>
        <Button onClick={handleContinue} disabled={!role || loading} className="w-full mt-4">
          {loading ? "Saving..." : "Continue"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          You can change your role later in your profile settings.
        </p>
      </div>
    </div>
  )
} 