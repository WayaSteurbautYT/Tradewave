"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    views: 0,
    supporters: 0,
    tokens: 0,
    live: 0,
  })
  const [recent, setRecent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      setLoading(true)
      // Fetch portfolio for views/tokens
      const profileRef = doc(db, "profiles", user.uid)
      const profileSnap = await getDoc(profileRef)
      let views = 0, tokens = 0
      if (profileSnap.exists() && profileSnap.data().portfolio) {
        for (const item of profileSnap.data().portfolio) {
          views += item.views || 0
          tokens += item.tokens || 0
        }
      }
      // Fetch supporters (future: real data)
      const supporters = 0 // Placeholder
      // Fetch live stats (future: real data)
      const live = 0 // Placeholder
      setStats({ views, supporters, tokens, live })
      // Fetch recent activity (uploads, earnings)
      const videosSnap = await getDocs(collection(db, "videos", user.uid, "userVideos"))
      const txSnap = await getDocs(collection(db, "tokens", user.uid, "transactions"))
      const recentUploads = videosSnap.docs.map(doc => ({
        type: "Upload",
        title: doc.data().title,
        date: doc.data().createdAt?.toDate?.() || null,
      }))
      const recentEarnings = txSnap.docs.filter(doc => doc.data().amount > 0).map(doc => ({
        type: "Earning",
        title: doc.data().description,
        date: doc.data().createdAt?.toDate?.() || null,
      }))
      setRecent([...recentUploads, ...recentEarnings].sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0)).slice(0, 8))
      setLoading(false)
    }
    fetchStats()
  }, [user])

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-teal-300">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <Card className="bg-teal-950/60 border-teal-800">
          <CardHeader><CardTitle className="text-lg text-teal-200">Total Views</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-teal-400">{loading ? '...' : stats.views}</div></CardContent>
        </Card>
        <Card className="bg-teal-950/60 border-teal-800">
          <CardHeader><CardTitle className="text-lg text-teal-200">Supporters</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-teal-400">{loading ? '...' : stats.supporters}</div></CardContent>
        </Card>
        <Card className="bg-teal-950/60 border-teal-800">
          <CardHeader><CardTitle className="text-lg text-teal-200">Tokens Earned</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-teal-400">{loading ? '...' : stats.tokens}</div></CardContent>
        </Card>
        <Card className="bg-teal-950/60 border-teal-800">
          <CardHeader><CardTitle className="text-lg text-teal-200">Live Stats</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-teal-400">{loading ? '...' : stats.live}</div></CardContent>
        </Card>
      </div>
      <Card className="mb-10 bg-teal-950/60 border-teal-800">
        <CardHeader><CardTitle className="text-2xl text-teal-200">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-teal-900">
            {recent.length === 0 && <li className="py-4 text-teal-500">No recent activity.</li>}
            {recent.map((item, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between">
                <span className="font-semibold text-teal-300">{item.type}</span>
                <span className="text-teal-200">{item.title}</span>
                <span className="text-xs text-teal-500">{item.date ? item.date.toLocaleString() : ''}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="bg-teal-950/60 border-teal-800">
        <CardHeader><CardTitle className="text-2xl text-teal-200">AI Insights & Live Analytics</CardTitle></CardHeader>
        <CardContent>
          <div className="text-teal-400">Coming soon: AI-powered recaps, suggestions, and real-time analytics using Whisper & Gemini.</div>
        </CardContent>
      </Card>
    </div>
  )
}
