"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function VideoTranscribePage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [transcript, setTranscript] = useState("")
  const [summary, setSummary] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"idle"|"transcribing"|"summarizing"|"qa">("idle")

  // Placeholder: Replace with backend call
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
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-teal-300">AI Video Transcription & Recap</h1>
      <Card className="mb-8 bg-teal-950/60 border-teal-800">
        <CardHeader><CardTitle className="text-2xl text-teal-200">Transcribe a Video</CardTitle></CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      {transcript && (
        <Card className="mb-8 bg-teal-950/60 border-teal-800">
          <CardHeader><CardTitle className="text-2xl text-teal-200">Transcript</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={transcript} readOnly rows={10} className="mb-4" />
            <Button onClick={handleSummarize} disabled={loading || step === "summarizing"}>
              {loading && step === "summarizing" ? "Summarizing..." : "Get AI Recap (Gemini)"}
            </Button>
          </CardContent>
        </Card>
      )}
      {summary && (
        <Card className="mb-8 bg-teal-950/60 border-teal-800">
          <CardHeader><CardTitle className="text-2xl text-teal-200">AI Recap</CardTitle></CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
      <Card className="bg-teal-950/60 border-teal-800">
        <CardHeader><CardTitle className="text-2xl text-teal-200">How it works</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 text-teal-400 text-sm space-y-1">
            <li>Upload a video or paste a YouTube link.</li>
            <li>OpenAI Whisper transcribes the audio to text.</li>
            <li>Google Gemini summarizes the transcript and answers your questions.</li>
            <li>All processing is done securely in the cloud. Your API key is used for Gemini.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 