"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface QAChatProps {
  translatedContent: string
}

export function QAChat({ translatedContent }: QAChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: `Based on the translated content, here's my answer: This is a simulated response to your question "${input}". In a real implementation, this would use RAG to answer based on the actual translated content.`,
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setInput("")
  }

  return (
    <Card className="glass-card p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Ask Questions</h3>
        <p className="text-sm text-muted-foreground">Ask anything about the translated content</p>
      </div>

      {/* Messages */}
      <div className="space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            No messages yet. Ask a question to get started!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
