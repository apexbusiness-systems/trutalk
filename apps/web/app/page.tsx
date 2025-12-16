import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, Mic, Users, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">TRU Talk</h1>
        <div className="flex gap-4">
          <Link href="/download">
            <Button variant="outline">Download App</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-background via-card to-background border border-border/50 p-8 md:p-16 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              
              <div className="relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text leading-[1.1]">
                    Connect Through Voice
                  </h2>
                  <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                    Break language barriers with real-time voice translation. Make authentic connections worldwide.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/download">
                      <Button size="lg" className="text-lg px-10 py-7 h-auto shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
                        <Download className="mr-2" />
                        Download App
                      </Button>
                    </Link>
                    <Link href="/features">
                      <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-muted/50 p-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <Globe className="w-12 h-12 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">Break Language Barriers</h4>
                    <p className="text-muted-foreground">Real-time voice translation lets you connect with anyone, anywhere.</p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                      <Mic className="w-12 h-12 text-secondary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">Authentic Conversations</h4>
                    <p className="text-muted-foreground">Voice-first connections create deeper, more meaningful relationships.</p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                      <Users className="w-12 h-12 text-accent" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">Global Community</h4>
                    <p className="text-muted-foreground">Join thousands making cross-cultural connections daily.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 TRU Talk. Breaking barriers through authentic conversations.</p>
      </footer>
    </div>
  );
}

