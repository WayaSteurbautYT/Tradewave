"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useAuth } from "@/lib/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import zxcvbn from "zxcvbn"

function PasswordStrengthBar({ password }: { password: string }) {
  const score = password ? zxcvbn(password).score : 0
  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"]
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"]
  return (
    <div className="mt-1">
      <div className="h-2 w-full bg-muted rounded">
        <div
          className={`h-2 rounded transition-all duration-300 ${colors[score]}`}
          style={{ width: `${(score + 1) * 20}%` }}
        />
      </div>
      {password && (
        <span className={`text-xs ${colors[score]} font-semibold`}>{labels[score]}</span>
      )}
    </div>
  )
}

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { signUp, signInWithGoogle, signInAnonymously } = useAuth() as any
  const { toast } = useToast()

  // Ensure role is selected
  if (typeof window !== "undefined" && !localStorage.getItem("tradewave_role")) {
    router.push("/role")
    return null
  }

  async function createUserIfNotExists(user: any) {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      const role = localStorage.getItem("tradewave_role") || "viewer"
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        role,
        createdAt: serverTimestamp(),
      })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const cred = await signUp(email, password)
      await createUserIfNotExists(cred.user)
      toast({ title: "Success", description: "Account created. You are now signed in." })
      router.push("/profile/setup")
    } catch (error: any) {
      setError(error?.message || "Could not create account.")
      toast({ variant: "destructive", title: "Error", description: error?.message || "Could not create account." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const cred = await signInWithGoogle()
      await createUserIfNotExists(cred.user)
      toast({ title: "Success", description: "You have been signed up with Google." })
      router.push("/profile/setup")
    } catch (error: any) {
      setError(error?.message || "Could not sign up with Google.")
      toast({ variant: "destructive", title: "Error", description: error?.message || "Could not sign up with Google." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymousSignUp = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const cred = await signInAnonymously()
      await createUserIfNotExists(cred.user)
      toast({ title: "Success", description: "You are signed up as a guest." })
      router.push("/profile/setup")
    } catch (error: any) {
      setError(error?.message || "Could not sign up as guest.")
      toast({ variant: "destructive", title: "Error", description: error?.message || "Could not sign up as guest." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 animate-fade-in">
      <form onSubmit={onSubmit} className="bg-gradient-to-br from-background via-muted to-card rounded-xl shadow-2xl p-6 space-y-4 transition-all duration-300">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
            <PasswordStrengthBar password={password} />
          </div>
          <Button disabled={isLoading} className="w-full shadow-lg hover:scale-[1.02] transition-transform">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
        {error && <p className="text-red-500 text-center mt-2 animate-shake">{error}</p>}
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignUp}
        className="w-full shadow-lg hover:scale-[1.02] transition-transform"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleAnonymousSignUp}
        className="w-full shadow-lg hover:scale-[1.02] transition-transform"
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.moon className="mr-2 h-4 w-4" />
        )}
        Continue as Guest
      </Button>
    </div>
  )
} 