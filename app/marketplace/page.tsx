"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function MarketplacePage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    category: '',
  })
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      const snap = await getDocs(collection(db, "marketplace"))
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    fetchProjects()
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert("You must be logged in to post a project.")
    setPosting(true)
    await addDoc(collection(db, "marketplace"), {
      ...form,
      budget: Number(form.budget),
      postedBy: user.uid,
      createdAt: serverTimestamp(),
      status: "open",
    })
    setForm({ title: '', description: '', budget: '', deadline: '', category: '' })
    setPosting(false)
    // Refresh project list
    const snap = await getDocs(collection(db, "marketplace"))
    setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-teal-300">Marketplace</h1>
      <Card className="mb-8 bg-teal-950/60 border-teal-800">
        <CardHeader><CardTitle className="text-2xl text-teal-200">Post a New Project</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handlePost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="title" value={form.title} onChange={handleInput} placeholder="Project Title" required />
            <Input name="category" value={form.category} onChange={handleInput} placeholder="Category" />
            <Textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" required className="md:col-span-2" />
            <Input name="budget" value={form.budget} onChange={handleInput} placeholder="Budget (tokens)" type="number" min={0} required />
            <Input name="deadline" value={form.deadline} onChange={handleInput} placeholder="Deadline (YYYY-MM-DD)" type="date" />
            <Button type="submit" disabled={posting} className="md:col-span-2">{posting ? 'Posting...' : 'Post Project'}</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-teal-950/60 border-teal-800">
        <CardHeader><CardTitle className="text-2xl text-teal-200">Open Projects</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {projects.length === 0 && <div className="text-teal-500">No open projects yet.</div>}
            {projects.map(project => (
              <Card key={project.id} className="bg-teal-900/20 border-teal-800">
                <CardHeader>
                  <CardTitle className="text-teal-300">{project.title}</CardTitle>
                  <div className="text-xs text-teal-400">{project.category} | Budget: {project.budget} tokens | Deadline: {project.deadline}</div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-teal-200">{project.description}</div>
                  <div className="text-xs text-teal-500">Posted: {project.createdAt?.toDate?.().toLocaleString?.() || ''}</div>
                  <Button disabled className="mt-2">Bid / Apply (Coming Soon)</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
