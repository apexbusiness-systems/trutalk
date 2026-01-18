import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";

export default function Landing() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with burger nav, language selector, and auth */}
      <Header transparent />

      {/* Full Viewport Hero */}
      <div className="flex-1 flex flex-col">
        {/* Hero Content Container */}
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-background via-card to-background border border-primary/20 p-6 md:p-10 lg:p-12 shadow-2xl">
              {/* Pulsing Red Background Glow */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Main pulsing glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
                {/* Secondary pulsing orbs */}
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                {/* Color overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              </div>

              <div className="relative z-10">
                {/* Hero Logo & Text */}
                <div className="text-center mb-8 md:mb-10">
                  {/* Large centered logo */}
                  <div className="flex justify-center mb-6 animate-fade-in">
                    <img
                      src="/icons/trutalk-logo.png"
                      alt="TRU Talk"
                      className="h-24 md:h-32 lg:h-40 w-auto drop-shadow-2xl"
                    />
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground animate-fade-in leading-tight" style={{ animationDelay: '0.1s' }}>
                    Voice-First Dating
                  </h2>
                  <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
                    Connect through authentic voice. AI-powered matching. Real-time translation across 50+ languages.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <Link to="/auth">
                      <Button size="lg" className="px-8 py-5 h-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-primary to-accent">
                        Get Started
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="px-8 py-5 h-auto hover:bg-primary/10 border-primary/30" onClick={scrollToFeatures}>
                      Try Demo
                    </Button>
                  </div>
                </div>

                {/* Feature Cards with Brand Icons */}
                <div className="grid md:grid-cols-3 gap-4 md:gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  {/* Voice Matching */}
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-5 md:p-6 flex flex-col items-center text-center border border-primary/10 hover:border-primary/30 transition-all hover:bg-card/70 group">
                    <div className="w-20 h-20 md:w-24 md:h-24 mb-4 transition-transform group-hover:scale-110">
                      <img
                        src="/icons/1.png"
                        alt="Voice Matching"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Authentic Conversations</h4>
                    <p className="text-muted-foreground text-sm">Voice-first connections create deeper, more meaningful relationships.</p>
                  </div>

                  {/* Translation */}
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-5 md:p-6 flex flex-col items-center text-center border border-primary/10 hover:border-primary/30 transition-all hover:bg-card/70 group">
                    <div className="w-20 h-20 md:w-24 md:h-24 mb-4 transition-transform group-hover:scale-110">
                      <img
                        src="/icons/2.png"
                        alt="Break Language Barriers"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Break Language Barriers</h4>
                    <p className="text-muted-foreground text-sm">Real-time voice translation lets you connect with anyone, anywhere.</p>
                  </div>

                  {/* Global Community */}
                  <div className="rounded-2xl bg-card/50 backdrop-blur-sm p-5 md:p-6 flex flex-col items-center text-center border border-primary/10 hover:border-primary/30 transition-all hover:bg-card/70 group">
                    <div className="w-20 h-20 md:w-24 md:h-24 mb-4 transition-transform group-hover:scale-110">
                      <img
                        src="/icons/3.png"
                        alt="Global Community"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-foreground mb-2">Global Community</h4>
                    <p className="text-muted-foreground text-sm">Join thousands making cross-cultural connections daily.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-3 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 TRU Talk</p>
        </footer>
      </div>

      <section id="features" className="sr-only" aria-hidden="true"></section>
    </div>
  );
}
