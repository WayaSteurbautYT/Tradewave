"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { 
  Auth,
  User,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<UserCredential>
  signUp: (email: string, password: string) => Promise<UserCredential>
  signInWithGoogle: () => Promise<UserCredential>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  const logout = () => {
    return signOut(auth)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
} 