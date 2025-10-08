"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/step-indicator"
import { AudioInputMethodStep } from "@/components/audio-input-method-step"
import { AudioInputStep } from "@/components/audio-input-step"
import { AudioConfigurationStep } from "@/components/audio-configuration-step"
import { AudioResultsStep } from "@/components/audio-results-step"

export type AudioInputMethod = "upload" | "record"
export type TranslationTone = "formal" | "informal" | "technical" | "conversational"

export interface AudioTranslationState {
  inputMethod: AudioInputMethod | null
  audioFile: File | null
  recordedBlob: Blob | null
  targetLanguage: string
  tone: TranslationTone
  summarize: boolean
  generateBanner: boolean
  generateAudio: boolean
  includeTimestamps: boolean
  enableQA: boolean
}

export default function AudioTranslationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, setState] = useState<AudioTranslationState>({
    inputMethod: null,
    audioFile: null,
    recordedBlob: null,
    targetLanguage: "",
    tone: "formal",
    summarize: false,
    generateBanner: false,
    generateAudio: false,
    includeTimestamps: false,
    enableQA: false,
  })

  const updateState = (updates: Partial<AudioTranslationState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleReset = () => {
    setCurrentStep(1)
    setState({
      inputMethod: null,
      audioFile: null,
      recordedBlob: null,
      targetLanguage: "",
      tone: "formal",
      summarize: false,
      generateBanner: false,
      generateAudio: false,
      includeTimestamps: false,
      enableQA: false,
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 cyberpunk-bg">
        <div className="grid-overlay" />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            {currentStep > 1 && currentStep < 4 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Start Over
              </Button>
            )}
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Audio Translation</h1>
            <p className="text-muted-foreground">Transcribe and translate audio content</p>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={4} />

          <div className="mt-12">
            {currentStep === 1 && (
              <AudioInputMethodStep
                selectedMethod={state.inputMethod}
                onSelect={(method) => updateState({ inputMethod: method })}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <AudioInputStep
                inputMethod={state.inputMethod!}
                audioFile={state.audioFile}
                recordedBlob={state.recordedBlob}
                onAudioFileChange={(file) => updateState({ audioFile: file })}
                onRecordedBlobChange={(blob) => updateState({ recordedBlob: blob })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <AudioConfigurationStep
                targetLanguage={state.targetLanguage}
                tone={state.tone}
                summarize={state.summarize}
                generateBanner={state.generateBanner}
                generateAudio={state.generateAudio}
                includeTimestamps={state.includeTimestamps}
                enableQA={state.enableQA}
                onTargetLanguageChange={(lang) => updateState({ targetLanguage: lang })}
                onToneChange={(tone) => updateState({ tone })}
                onSummarizeChange={(summarize) => updateState({ summarize })}
                onGenerateBannerChange={(generateBanner) => updateState({ generateBanner })}
                onGenerateAudioChange={(generateAudio) => updateState({ generateAudio })}
                onIncludeTimestampsChange={(includeTimestamps) => updateState({ includeTimestamps })}
                onEnableQAChange={(enableQA) => updateState({ enableQA })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && <AudioResultsStep state={state} onReset={handleReset} />}
          </div>
        </div>
      </div>
    </div>
  )
}
