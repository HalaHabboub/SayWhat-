"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { InputMethod } from "@/app/text-translation/page"

interface ContentInputStepProps {
  inputMethod: InputMethod
  content: string
  file: File | null
  url: string
  onContentChange: (content: string) => void
  onFileChange: (file: File | null) => void
  onUrlChange: (url: string) => void
  onNext: () => void
  onBack: () => void
}

export function ContentInputStep({
  inputMethod,
  content,
  file,
  url,
  onContentChange,
  onFileChange,
  onUrlChange,
  onNext,
  onBack,
}: ContentInputStepProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0])
    }
  }

  const isValid = () => {
    if (inputMethod === "upload") return file !== null
    if (inputMethod === "url") return url.trim().length > 0
    if (inputMethod === "paste") return content.trim().length > 0
    return false
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Provide Your Content</h2>
        <p className="text-muted-foreground">
          {inputMethod === "upload" && "Upload your document file"}
          {inputMethod === "url" && "Enter the URL of the content to translate"}
          {inputMethod === "paste" && "Paste or type your text content"}
        </p>
      </div>

      <Card className="glass-card p-8">
        {inputMethod === "upload" && (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onFileChange(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop your file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.txt,.docx,.md"
                  onChange={handleFileInput}
                />
                <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Select File
                </Button>
              </>
            )}
          </div>
        )}

        {inputMethod === "url" && (
          <div className="space-y-4">
            <Input
              type="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Enter the full URL of the web page you want to translate</p>
          </div>
        )}

        {inputMethod === "paste" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Paste or type your text here..."
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="min-h-[300px] text-base"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Character count: {content.length}</span>
              <span>Word count: {content.trim().split(/\s+/).filter(Boolean).length}</span>
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid()}>
          Continue
        </Button>
      </div>
    </div>
  )
}
