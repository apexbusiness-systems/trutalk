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

      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Connect Through Voice
        </h2>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Break language barriers with real-time voice translation. Make authentic connections worldwide.
        </p>
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link to="/auth">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg" onClick={scrollToFeatures}>
            Learn More
          </Button>
        </div>
      </main>

      <section id="features" className="container mx-auto px-4 py-24">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">Why TRU Talk?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card hover:bg-accent/10 transition-colors">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Break Language Barriers</h4>
            <p className="text-muted-foreground">Real-time voice translation lets you connect with anyone, anywhere in the world.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card hover:bg-accent/10 transition-colors">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Authentic Conversations</h4>
            <p className="text-muted-foreground">Voice-first connections create deeper, more meaningful relationships.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card hover:bg-accent/10 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Global Community</h4>
            <p className="text-muted-foreground">Join thousands of people making cross-cultural connections daily.</p>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 TRU Talk. Breaking barriers through authentic conversations.</p>
      </footer>
    </div>
  );
}
