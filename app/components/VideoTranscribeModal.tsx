"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface VideoTranscribeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileUrl?: string
}

export function VideoTranscribeModal({ open, onOpenChange, fileUrl }: VideoTranscribeModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState("")
  const [summary, setSummary] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"idle"|"transcribing"|"summarizing"|"qa">("idle")

  // Auto-start transcription if fileUrl is provided
  useEffect(() => {
    if (open && fileUrl) {
      setYoutubeUrl("")
      setVideoFile(null)
      setTranscript("")
      setSummary("")
      setQuestion("")
      setAnswer("")
      setStep("transcribing")
      setLoading(true)
      // TODO: Call backend/serverless function to run Whisper on fileUrl
      setTimeout(() => {
        setTranscript(`[Transcript for video: ${fileUrl} (placeholder)]`)
        setStep("summarizing")
        setLoading(false)
      }, 2000)
    }
  }, [open, fileUrl])

  // Manual workflow for YouTube/upload
  const handleTranscribe = async () => {
    setLoading(true)
    setStep("transcribing")
    // TODO: Call backend/serverless function to run Whisper on videoFile or youtubeUrl
    setTimeout(() => {
      setTranscript("[Transcript will appear here. This is a placeholder.]")
      setStep("summarizing")
      setLoading(false)
    }, 2000)
  }

  // Placeholder: Replace with Gemini API call
  const handleSummarize = async () => {
    setLoading(true)
    setStep("summarizing")
    // TODO: Call Gemini API with transcript and your API key
    setTimeout(() => {
      setSummary("[Summary will appear here. This is a placeholder.]")
      setStep("qa")
      setLoading(false)
    }, 2000)
  }

  // Placeholder: Replace with Gemini API call
  const handleAsk = async () => {
    setLoading(true)
    setStep("qa")
    // TODO: Call Gemini API with transcript + question and your API key
    setTimeout(() => {
      setAnswer("[Answer will appear here. This is a placeholder.]")
      setLoading(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Video Transcription & Recap</DialogTitle>
        </DialogHeader>
        {!fileUrl && (
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Paste YouTube link here"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                disabled={loading}
              />
              <div className="text-center text-teal-400">or</div>
              <Input
                type="file"
                accept="video/*,audio/*"
                onChange={e => setVideoFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
              <Button onClick={handleTranscribe} disabled={loading || (!youtubeUrl && !videoFile)}>
                {loading && step === "transcribing" ? "Transcribing..." : "Transcribe"}
              </Button>
            </div>
          </div>
        )}
        {(transcript || fileUrl) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-200 mb-2">Transcript</h2>
            <Textarea value={transcript} readOnly rows={10} className="mb-4" />
            <Button onClick={handleSummarize} disabled={loading || step === "summarizing"}>
              {loading && step === "summarizing" ? "Summarizing..." : "Get AI Recap (Gemini)"}
            </Button>
          </div>
        )}
        {summary && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-teal-200 mb-2">AI Recap</h2>
            <Textarea value={summary} readOnly rows={6} className="mb-4" />
            <div className="flex gap-2 items-end">
              <Input
                type="text"
                placeholder="Ask a question about the video..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleAsk} disabled={loading || !question}>
                {loading && step === "qa" ? "Asking..." : "Ask Gemini"}
              </Button>
            </div>
            {answer && <div className="mt-4 text-teal-300"><b>Answer:</b> {answer}</div>}
          </div>
        )}
        <div className="bg-teal-950/60 border-teal-800 rounded p-4">
          <h3 className="text-lg font-semibold text-teal-200 mb-2">How it works</h3>
          <ul className="list-disc pl-6 text-teal-400 text-sm space-y-1">
            <li>Upload a video or paste a YouTube link, or use a video from TradeWave.</li>
            <li>OpenAI Whisper transcribes the audio to text.</li>
            <li>Google Gemini summarizes the transcript and answers your questions.</li>
            <li>All processing is done securely in the cloud. Your API key is used for Gemini.</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
} 