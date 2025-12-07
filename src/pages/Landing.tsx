import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, Mic, Users } from "lucide-react";

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center animate-fade-in">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TRU Talk
        </h1>
        <Link to="/auth">
          <Button variant="outline">Sign In</Button>
        </Link>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section - Unified */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-background via-card to-background border border-border/50 p-8 md:p-16 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              
              <div className="relative z-10">
                {/* Hero Content */}
                <div className="text-center mb-16">
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in leading-[1.1]" style={{ animationDelay: '0.1s' }}>
                    Connect Through Voice
                  </h2>
                  <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                    Break language barriers with real-time voice translation. Make authentic connections worldwide.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link to="/auth">
                      <Button size="lg" className="text-lg px-10 py-7 h-auto shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
                        Get Started
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto hover:bg-accent/10" onClick={scrollToFeatures}>
                      Try Demo
                    </Button>
                  </div>
                </div>

                {/* Feature Cards - Clean minimal layout */}
                <div className="grid md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="rounded-2xl bg-muted/50 p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Break Language Barriers</h4>
                    <p className="text-muted-foreground text-sm">Real-time voice translation lets you connect with anyone, anywhere.</p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-6">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                      <Mic className="w-6 h-6 text-secondary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Authentic Conversations</h4>
                    <p className="text-muted-foreground text-sm">Voice-first connections create deeper, more meaningful relationships.</p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Global Community</h4>
                    <p className="text-muted-foreground text-sm">Join thousands making cross-cultural connections daily.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="sr-only" aria-hidden="true"></section>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 TRU Talk. Breaking barriers through authentic conversations.</p>
      </footer>
    </div>
  );
}
