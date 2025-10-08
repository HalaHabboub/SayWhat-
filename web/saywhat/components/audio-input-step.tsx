"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Upload, X, Mic, Square, Play, Pause } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AudioInputMethod } from "@/app/audio-translation/page"

interface AudioInputStepProps {
  inputMethod: AudioInputMethod
  audioFile: File | null
  recordedBlob: Blob | null
  onAudioFileChange: (file: File | null) => void
  onRecordedBlobChange: (blob: Blob | null) => void
  onNext: () => void
  onBack: () => void
}

export function AudioInputStep({
  inputMethod,
  audioFile,
  recordedBlob,
  onAudioFileChange,
  onRecordedBlobChange,
  onNext,
  onBack,
}: AudioInputStepProps) {
  const [dragActive, setDragActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationRef = useRef<number | null>(null)

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
      onAudioFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAudioFileChange(e.target.files[0])
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      // Setup audio visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 2048
      drawWaveform()

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        onRecordedBlobChange(blob)
        setAudioUrl(URL.createObjectURL(blob))
        stream.getTracks().forEach((track) => track.stop())
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } else {
        mediaRecorderRef.current.pause()
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
      setIsPaused(!isPaused)
    }
  }

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)
      analyserRef.current!.getByteTimeDomainData(dataArray)

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.lineWidth = 2
      ctx.strokeStyle = "rgb(0, 255, 255)"
      ctx.beginPath()

      const sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * canvas.height) / 2

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        x += sliceWidth
      }

      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }

    draw()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isValid = () => {
    if (inputMethod === "upload") return audioFile !== null
    if (inputMethod === "record") return recordedBlob !== null
    return false
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Provide Your Audio</h2>
        <p className="text-muted-foreground">
          {inputMethod === "upload" && "Upload your audio file"}
          {inputMethod === "record" && "Record audio using your microphone"}
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
            {audioFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 text-left">
                    <p className="font-medium">{audioFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onAudioFileChange(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <audio controls className="w-full mt-4">
                  <source src={URL.createObjectURL(audioFile)} />
                </audio>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Drop your audio file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  id="audio-upload"
                  className="hidden"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg"
                  onChange={handleFileInput}
                />
                <Button variant="outline" onClick={() => document.getElementById("audio-upload")?.click()}>
                  Select File
                </Button>
              </>
            )}
          </div>
        )}

        {inputMethod === "record" && (
          <div className="space-y-6">
            {/* Waveform Visualization */}
            <div className="rounded-lg overflow-hidden bg-black/50">
              <canvas ref={canvasRef} width={800} height={200} className="w-full h-[200px]" />
            </div>

            {/* Recording Controls */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-3xl font-mono font-bold">{formatTime(recordingTime)}</div>

              <div className="flex gap-3">
                {!isRecording && !recordedBlob && (
                  <Button onClick={startRecording} size="lg" className="gap-2">
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <>
                    <Button onClick={pauseRecording} variant="outline" size="lg" className="gap-2 bg-transparent">
                      {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button onClick={stopRecording} variant="destructive" size="lg" className="gap-2">
                      <Square className="w-5 h-5" />
                      Stop
                    </Button>
                  </>
                )}

                {recordedBlob && !isRecording && (
                  <Button
                    onClick={() => {
                      onRecordedBlobChange(null)
                      setAudioUrl(null)
                      setRecordingTime(0)
                    }}
                    variant="outline"
                    size="lg"
                  >
                    Record Again
                  </Button>
                )}
              </div>

              {/* Audio Preview */}
              {audioUrl && !isRecording && (
                <div className="w-full mt-4">
                  <p className="text-sm font-medium mb-2">Preview Recording</p>
                  <audio controls className="w-full">
                    <source src={audioUrl} />
                  </audio>
                </div>
              )}
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
