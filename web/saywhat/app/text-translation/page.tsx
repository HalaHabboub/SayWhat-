"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StepIndicator } from "@/components/step-indicator"
import { InputMethodStep } from "@/components/input-method-step"
import { ContentInputStep } from "@/components/content-input-step"
import { ConfigurationStep } from "@/components/configuration-step"
import { ResultsStep } from "@/components/results-step"

export type InputMethod = "upload" | "url" | "paste"
export type TranslationTone = "formal" | "informal" | "technical" | "conversational"

export interface TextTranslationState {
  inputMethod: InputMethod | null
  content: string
  file: File | null
  url: string
  targetLanguage: string
  tone: TranslationTone
  summarize: boolean
  generateBanner: boolean
  generateAudio: boolean
  enableQA: boolean
}

export default function TextTranslationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, setState] = useState<TextTranslationState>({
    inputMethod: null,
    content: "",
    file: null,
    url: "",
    targetLanguage: "",
    tone: "formal",
    summarize: false,
    generateBanner: false,
    generateAudio: false,
    enableQA: false,
  })

  const updateState = (updates: Partial<TextTranslationState>) => {
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
      content: "",
      file: null,
      url: "",
      targetLanguage: "",
      tone: "formal",
      summarize: false,
      generateBanner: false,
      generateAudio: false,
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Text Translation</h1>
            <p className="text-muted-foreground">Translate documents, web pages, and text content</p>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={4} />

          <div className="mt-12">
            {currentStep === 1 && (
              <InputMethodStep
                selectedMethod={state.inputMethod}
                onSelect={(method) => updateState({ inputMethod: method })}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <ContentInputStep
                inputMethod={state.inputMethod!}
                content={state.content}
                file={state.file}
                url={state.url}
                onContentChange={(content) => updateState({ content })}
                onFileChange={(file) => updateState({ file })}
                onUrlChange={(url) => updateState({ url })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ConfigurationStep
                targetLanguage={state.targetLanguage}
                tone={state.tone}
                summarize={state.summarize}
                generateBanner={state.generateBanner}
                generateAudio={state.generateAudio}
                enableQA={state.enableQA}
                onTargetLanguageChange={(lang) => updateState({ targetLanguage: lang })}
                onToneChange={(tone) => updateState({ tone })}
                onSummarizeChange={(summarize) => updateState({ summarize })}
                onGenerateBannerChange={(generateBanner) => updateState({ generateBanner })}
                onGenerateAudioChange={(generateAudio) => updateState({ generateAudio })}
                onEnableQAChange={(enableQA) => updateState({ enableQA })}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && <ResultsStep state={state} onReset={handleReset} />}
          </div>
        </div>
      </div>
    </div>
  )
}
