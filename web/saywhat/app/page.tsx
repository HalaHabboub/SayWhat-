import Link from "next/link"
import { FileText, Mic } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 cyberpunk-bg">
        <div className="grid-overlay" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight neon-text">Say What?</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            AI-Powered Multi-Language Translation
          </p>
          <p className="text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto">
            Transform text and audio across languages with cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <Link href="/text-translation" className="group">
            <Card className="glass-card p-12 h-full flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:scale-105 hover:neon-glow cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Text Translation</h2>
                <p className="text-muted-foreground">Upload documents, paste text, or enter URLs to translate</p>
              </div>
              <div className="mt-4 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Get Started
              </div>
            </Card>
          </Link>

          <Link href="/audio-translation" className="group">
            <Card className="glass-card p-12 h-full flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:scale-105 hover:neon-glow cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Mic className="w-12 h-12 text-accent" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Audio Translation</h2>
                <p className="text-muted-foreground">Upload audio files or record live to transcribe and translate</p>
              </div>
              <div className="mt-4 px-6 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                Get Started
              </div>
            </Card>
          </Link>
        </div>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Powered by advanced AI language models</p>
        </footer>
      </div>
    </div>
  )
}
