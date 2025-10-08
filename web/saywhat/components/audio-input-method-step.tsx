"use client"

import { Upload, Mic } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AudioInputMethod } from "@/app/audio-translation/page"

interface AudioInputMethodStepProps {
  selectedMethod: AudioInputMethod | null
  onSelect: (method: AudioInputMethod) => void
  onNext: () => void
}

export function AudioInputMethodStep({ selectedMethod, onSelect, onNext }: AudioInputMethodStepProps) {
  const methods = [
    {
      id: "upload" as AudioInputMethod,
      icon: Upload,
      title: "Upload Audio File",
      description: "MP3, WAV, M4A, OGG files supported",
    },
    {
      id: "record" as AudioInputMethod,
      icon: Mic,
      title: "Record Audio",
      description: "Live recording with browser microphone",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Audio Input Method</h2>
        <p className="text-muted-foreground">How would you like to provide your audio?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {methods.map((method) => {
          const Icon = method.icon
          const isSelected = selectedMethod === method.id
          return (
            <Card
              key={method.id}
              className={`glass-card p-8 cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected ? "neon-glow border-primary" : ""
              }`}
              onClick={() => onSelect(method.id)}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-primary/20" : "bg-primary/10"
                  }`}
                >
                  <Icon className={`w-8 h-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={onNext} disabled={!selectedMethod} className="min-w-[200px]">
          Continue
        </Button>
      </div>
    </div>
  )
}
