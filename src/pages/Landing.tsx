import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Mic, Users } from "lucide-react";

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Full Viewport Hero */}
      <div className="flex-1 flex flex-col">
        {/* Header - Integrated into hero */}
        <header className="container mx-auto px-4 py-4 flex justify-between items-center animate-fade-in">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TRU Talk
          </h1>
          <Link to="/auth">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </header>

        {/* Hero Content Container */}
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-background via-card to-background border border-border/50 p-6 md:p-10 lg:p-12 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              
              <div className="relative z-10">
                {/* Hero Text Content */}
                <div className="text-center mb-8 md:mb-10">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
                    Connect Through Voice
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                    Break language barriers with real-time voice translation. Make authentic connections worldwide.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link to="/auth">
                      <Button size="lg" className="px-8 py-5 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                        Get Started
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="px-8 py-5 h-auto hover:bg-accent/10" onClick={scrollToFeatures}>
                      Try Demo
                    </Button>
                  </div>
                </div>

                {/* Feature Cards - Properly Proportioned */}
                <div className="grid md:grid-cols-3 gap-4 md:gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="rounded-2xl bg-muted/30 backdrop-blur-sm p-5 md:p-6 flex flex-col items-center text-center hover:bg-muted/40 transition-colors">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Globe className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Break Language Barriers</h4>
                    <p className="text-muted-foreground text-sm">Real-time voice translation lets you connect with anyone, anywhere.</p>
                  </div>

                  <div className="rounded-2xl bg-muted/30 backdrop-blur-sm p-5 md:p-6 flex flex-col items-center text-center hover:bg-muted/40 transition-colors">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Mic className="w-7 h-7 md:w-8 md:h-8 text-secondary" />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Authentic Conversations</h4>
                    <p className="text-muted-foreground text-sm">Voice-first connections create deeper, more meaningful relationships.</p>
                  </div>

                  <div className="rounded-2xl bg-muted/30 backdrop-blur-sm p-5 md:p-6 flex flex-col items-center text-center hover:bg-muted/40 transition-colors">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Users className="w-7 h-7 md:w-8 md:h-8 text-accent" />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Global Community</h4>
                    <p className="text-muted-foreground text-sm">Join thousands making cross-cultural connections daily.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="container mx-auto px-4 py-3 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 TRU Talk</p>
        </footer>
      </div>

      <section id="features" className="sr-only" aria-hidden="true"></section>
    </div>
  );
}
