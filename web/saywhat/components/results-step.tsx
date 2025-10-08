"use client"

import { useState, useEffect } from "react"
import { Download, Copy, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { TextTranslationState } from "@/app/text-translation/page"
import { QAChat } from "@/components/qa-chat"

interface ResultsStepProps {
  state: TextTranslationState
  onReset: () => void
}

export function ResultsStep({ state, onReset }: ResultsStepProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          return 100
        }
        return prev + 10
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(mockTranslation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mockTranslation = `# Translated Content

This is a sample translation of your content. In a real implementation, this would be the actual translated text from your AI translation service.

The translation maintains the original meaning while adapting to the target language and tone you selected.

## Key Points

- Professional translation quality
- Maintains context and nuance
- Adapted to ${state.tone} tone
- Translated to ${state.targetLanguage}

${state.summarize ? "\n## Summary\n\nThis is a concise summary of the translated content, highlighting the main points and key takeaways." : ""}`

  if (isProcessing) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Processing Translation</h2>
          <p className="text-muted-foreground">Please wait while we translate your content...</p>
        </div>

        <Card className="glass-card p-12">
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {progress < 30 && "Analyzing content..."}
              {progress >= 30 && progress < 60 && "Translating text..."}
              {progress >= 60 && progress < 90 && "Applying tone adjustments..."}
              {progress >= 90 && "Finalizing translation..."}
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
        <p className="text-muted-foreground">Your content has been successfully translated</p>
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
        </div>

        {/* Generated Banner */}
        {state.generateBanner && (
          <div className="rounded-lg overflow-hidden">
            <img src="/abstract-translation-banner.jpg" alt="Translation banner" className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Translation Content */}
        <div className="prose prose-invert max-w-none">
          <div className="p-6 rounded-lg bg-secondary/30 whitespace-pre-wrap">{mockTranslation}</div>
        </div>

        {/* Audio Player */}
        {state.generateAudio && (
          <div className="p-4 rounded-lg bg-secondary/50">
            <p className="text-sm font-medium mb-2">Generated Audio</p>
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
            Download MD
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
