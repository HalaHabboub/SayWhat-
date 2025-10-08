"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { TranslationTone } from "@/app/text-translation/page"

interface ConfigurationStepProps {
  targetLanguage: string
  tone: TranslationTone
  summarize: boolean
  generateBanner: boolean
  generateAudio: boolean
  enableQA: boolean
  onTargetLanguageChange: (lang: string) => void
  onToneChange: (tone: TranslationTone) => void
  onSummarizeChange: (value: boolean) => void
  onGenerateBannerChange: (value: boolean) => void
  onGenerateAudioChange: (value: boolean) => void
  onEnableQAChange: (value: boolean) => void
  onNext: () => void
  onBack: () => void
}

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
]

export function ConfigurationStep({
  targetLanguage,
  tone,
  summarize,
  generateBanner,
  generateAudio,
  enableQA,
  onTargetLanguageChange,
  onToneChange,
  onSummarizeChange,
  onGenerateBannerChange,
  onGenerateAudioChange,
  onEnableQAChange,
  onNext,
  onBack,
}: ConfigurationStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Configure Translation</h2>
        <p className="text-muted-foreground">Customize your translation settings</p>
      </div>

      <Card className="glass-card p-8 space-y-8">
        {/* Target Language */}
        <div className="space-y-3">
          <Label htmlFor="target-language" className="text-base font-medium">
            Target Language
          </Label>
          <Select value={targetLanguage} onValueChange={onTargetLanguageChange}>
            <SelectTrigger id="target-language" className="w-full">
              <SelectValue placeholder="Select target language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Translation Tone */}
        <div className="space-y-3">
          <Label htmlFor="tone" className="text-base font-medium">
            Translation Tone
          </Label>
          <Select value={tone} onValueChange={(value) => onToneChange(value as TranslationTone)}>
            <SelectTrigger id="tone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="informal">Informal</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Optional Features */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Optional Features</Label>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="space-y-0.5">
                <Label htmlFor="summarize" className="text-sm font-medium cursor-pointer">
                  Summarize Content
                </Label>
                <p className="text-xs text-muted-foreground">Generate a concise summary of the translation</p>
              </div>
              <Switch id="summarize" checked={summarize} onCheckedChange={onSummarizeChange} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="space-y-0.5">
                <Label htmlFor="banner" className="text-sm font-medium cursor-pointer">
                  Generate Image Banner
                </Label>
                <p className="text-xs text-muted-foreground">Create a visual banner for your translation</p>
              </div>
              <Switch id="banner" checked={generateBanner} onCheckedChange={onGenerateBannerChange} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="space-y-0.5">
                <Label htmlFor="audio" className="text-sm font-medium cursor-pointer">
                  Generate Audio (TTS)
                </Label>
                <p className="text-xs text-muted-foreground">Convert translation to speech audio</p>
              </div>
              <Switch id="audio" checked={generateAudio} onCheckedChange={onGenerateAudioChange} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="space-y-0.5">
                <Label htmlFor="qa" className="text-sm font-medium cursor-pointer">
                  Enable Q&A RAG System
                </Label>
                <p className="text-xs text-muted-foreground">Ask questions about the translated content</p>
              </div>
              <Switch id="qa" checked={enableQA} onCheckedChange={onEnableQAChange} />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!targetLanguage}>
          Translate
        </Button>
      </div>
    </div>
  )
}
