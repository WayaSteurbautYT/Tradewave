"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/context/auth-context"
import { db } from "@/lib/firebase"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function VideoUploadPage() {
  const { user } = useAuth()
  const [videos, setVideos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [form, setForm] = useState({
    title: '',
    description: '',
    tags: '',
    category: '',
    license: '',
    file: null as File | null,
  })
  const router = useRouter()

  useEffect(() => {
    async function fetchVideos() {
      if (!user) return
      const snap = await getDocs(collection(db, "videos", user.uid, "userVideos"))
      setVideos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    }
    fetchVideos()
  }, [user])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(prev => ({ ...prev, file: e.target.files![0] }))
    }
  }
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.file) return
    setUploading(true)
    setProgress(0)
    const storage = getStorage()
    const storageRef = ref(storage, `videos/${user.uid}/${Date.now()}_${form.file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, form.file)
    uploadTask.on('state_changed',
      (snapshot) => {
        setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
      },
      (error) => {
        alert("Upload failed: " + error.message)
        setUploading(false)
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        const videoDoc = {
          title: form.title,
          description: form.description,
          tags: form.tags.split(',').map(t => t.trim()),
          category: form.category,
          license: form.license,
          fileUrl: url,
          fileName: form.file!.name,
          createdAt: serverTimestamp(),
        }
        await addDoc(collection(db, "videos", user.uid, "userVideos"), videoDoc)
        setForm({ title: '', description: '', tags: '', category: '', license: '', file: null })
        setProgress(0)
        setUploading(false)
        // Refresh video list
        const snap = await getDocs(collection(db, "videos", user.uid, "userVideos"))
        setVideos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      }
    )
  }
  const handleDelete = async (video: any) => {
    if (!user) return
    if (!window.confirm("Delete this video?")) return
    await deleteDoc(doc(db, "videos", user.uid, "userVideos", video.id))
    if (video.fileUrl) {
      const storage = getStorage()
      const fileRef = ref(storage, video.fileUrl)
      try { await deleteObject(fileRef) } catch {}
    }
    setVideos(videos.filter(v => v.id !== video.id))
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-teal-300">Upload & Manage Videos</h1>
      <form onSubmit={handleUpload} className="mb-8 space-y-4 bg-teal-950/60 p-6 rounded-xl shadow-lg">
        <Input name="title" value={form.title} onChange={handleInput} placeholder="Title" required />
        <Textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" required />
        <Input name="tags" value={form.tags} onChange={handleInput} placeholder="Tags (comma separated)" />
        <Input name="category" value={form.category} onChange={handleInput} placeholder="Category" />
        <Input name="license" value={form.license} onChange={handleInput} placeholder="License (e.g. MIT, CC-BY)" />
        <Input type="file" accept="video/*" onChange={handleFile} required />
        <Button type="submit" disabled={uploading}>{uploading ? `Uploading... ${progress}%` : "Upload Video"}</Button>
        {uploading && <div className="w-full bg-teal-900 rounded h-2 mt-2"><div className="bg-teal-400 h-2 rounded" style={{ width: `${progress}%` }} /></div>}
      </form>
      <div className="grid gap-6">
        {videos.map(video => (
          <Card key={video.id} className="bg-teal-900/20 border-teal-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-teal-200">{video.title}</CardTitle>
                <div className="text-xs text-teal-400">{video.category} | {video.license}</div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(video)}>Delete</Button>
            </CardHeader>
            <CardContent>
              <video src={video.fileUrl} controls className="rounded w-full max-h-64 mb-2" />
              <div className="text-teal-300 font-semibold mb-1">{video.description}</div>
              <div className="text-xs text-teal-400 mb-2">Tags: {video.tags && video.tags.join(', ')}</div>
              <div className="text-xs text-teal-500">Uploaded: {video.createdAt?.toDate?.().toLocaleString?.() || ""}</div>
              <Button
                className="mt-4"
                onClick={() => router.push(`/ai-tools/video-transcribe?fileUrl=${encodeURIComponent(video.fileUrl)}`)}
                variant="secondary"
              >
                Transcribe & Analyze with AI
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 