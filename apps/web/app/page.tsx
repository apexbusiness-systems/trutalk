'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

// Generate stable random values for particles (SSR-safe)
const particleSeeds = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  leftPercent: ((i * 17 + 13) % 100),
  topPercent: ((i * 23 + 7) % 100),
  size: 2 + (i % 2),
}));

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient && particleSeeds.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-primary/20 rounded-full animate-float"
            style={{
              left: `${particle.leftPercent}%`,
              top: `${particle.topPercent}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${3 + (particle.id % 3)}s`,
              animationDelay: `${particle.id * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10 animate-fade-in-down">
        <div className="flex items-center">
          <Image
            src="/images/trutalk-logo.svg"
            alt="TRU Talk Logo"
            width={140}
            height={56}
            priority
            className="h-14 w-auto"
          />
        </div>
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
                <div className="text-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text leading-[1.1] animate-scale-in" style={{ animationDelay: '0.3s' }}>
                    Connect Through Voice
                  </h2>
                  <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    Break language barriers with real-time voice translation. Make authentic connections worldwide.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                    <Link href="/download">
                      <Button size="lg" className="text-lg px-10 py-7 h-auto shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200">
                        <Download className="mr-2" />
                        Download App
                      </Button>
                    </Link>
                    <Link href="/features">
                      <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto hover:scale-105 active:scale-95 transition-all duration-200">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                  {[
                    {
                      icon: '/images/icon-voice-matching.svg',
                      title: 'Voice Matching',
                      description: 'AI analyzes emotions and vibes in your voice',
                      delay: '1.0s',
                    },
                    {
                      icon: '/images/icon-break-barriers.svg',
                      title: 'Break Barriers',
                      description: 'Real-time translation in any language',
                      delay: '1.1s',
                    },
                    {
                      icon: '/images/icon-instant-calls.svg',
                      title: 'Instant Calls',
                      description: 'Jump straight to meaningful conversations',
                      delay: '1.2s',
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-muted/50 p-8 flex flex-col items-center text-center cursor-pointer hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: feature.delay }}
                    >
                      <div className="w-24 h-24 flex items-center justify-center mb-6 hover:scale-110 hover:rotate-6 transition-all duration-300">
                        <Image
                          src={feature.icon}
                          alt={feature.title}
                          width={96}
                          height={96}
                          className="w-full h-full"
                        />
                      </div>
                      <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground relative z-10 animate-fade-in" style={{ animationDelay: '1.3s' }}>
        <p>&copy; 2025 TRU Talk. Breaking barriers through authentic conversations.</p>
      </footer>
    </div>
  );
}
