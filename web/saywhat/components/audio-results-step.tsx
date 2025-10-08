"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AudioTranslationState } from "@/app/audio-translation/page"
import { QAChat } from "@/components/qa-chat"

interface AudioResultsStepProps {
  state: AudioTranslationState
  onReset: () => void
}

export function AudioResultsStep({ state, onReset }: AudioResultsStepProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 8
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(mockTranslation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mockTranscript = `[00:00] Welcome to this audio recording.
[00:05] Today we'll be discussing the importance of language translation.
[00:12] Translation helps bridge communication gaps across cultures.
[00:20] It enables global collaboration and understanding.`

  const mockTranslation = `# Translated Audio Content

This is a sample translation of your audio content. In a real implementation, this would be the actual transcribed and translated text from your AI translation service.

## Translation Details

The audio has been transcribed, translated, and formatted according to your preferences.

- **Duration**: 2 minutes 34 seconds
- **Detected Language**: English
- **Target Language**: ${state.targetLanguage}
- **Tone**: ${state.tone}

${state.summarize ? "\n## Summary\n\nThis audio discusses the importance of language translation in bridging communication gaps and enabling global collaboration." : ""}

## Full Translation

Welcome to this audio recording. Today we'll be discussing the importance of language translation. Translation helps bridge communication gaps across cultures. It enables global collaboration and understanding.`

  if (isProcessing) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Processing Audio</h2>
          <p className="text-muted-foreground">Transcribing and translating your audio...</p>
        </div>

        <Card className="glass-card p-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {progress < 25 && "Analyzing audio..."}
              {progress >= 25 && progress < 50 && "Transcribing speech..."}
              {progress >= 50 && progress < 75 && "Translating content..."}
              {progress >= 75 && "Finalizing translation..."}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Translation Complete</h2>
        <p className="text-muted-foreground">Your audio has been successfully transcribed and translated</p>
      </div>

      <Card className="glass-card p-8 space-y-6">
        {/* Language Badges */}
        <div className="flex items-center gap-4 flex-wrap">
          <Badge variant="secondary" className="text-sm">
            Source: English
          </Badge>
          <span className="text-muted-foreground">→</span>
          <Badge variant="default" className="text-sm">
            Target: {state.targetLanguage.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Tone: {state.tone}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Duration: 2:34
          </Badge>
        </div>

        {/* Generated Banner */}
        {state.generateBanner && (
          <div className="rounded-lg overflow-hidden">
            <img src="/audio-translation-banner.jpg" alt="Translation banner" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Original Transcript (Collapsible) */}
        <div className="border border-border rounded-lg">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="font-medium">Original Transcript</span>
            {showTranscript ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {showTranscript && (
            <div className="p-4 border-t border-border">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{mockTranscript}</pre>
            </div>
          )}
        </div>

        {/* Translation Content */}
        <div className="prose prose-invert max-w-none">
          <div className="p-6 rounded-lg bg-secondary/30 whitespace-pre-wrap">{mockTranslation}</div>
        </div>

        {/* Audio Player */}
        {state.generateAudio && (
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm font-medium mb-2">Translated Audio</p>
            <audio controls className="w-full">
              <source src="/placeholder-audio.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleCopy} variant="outline" className="gap-2 bg-transparent">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Text"}
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download Transcript
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Download Translation
          </Button>
          {state.generateAudio && (
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Download Audio
            </Button>
          )}
        </div>
      </Card>

      {/* Q&A Section */}
      {state.enableQA && <QAChat translatedContent={mockTranslation} />}

      {/* Reset Button */}
      <div className="flex justify-center">
        <Button onClick={onReset} size="lg">
          Translate Another
        </Button>
      </div>
    </div>
  )
}
