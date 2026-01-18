'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Generate stable random values for particles (SSR-safe)
const particleSeeds = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  leftPercent: ((i * 17 + 13) % 100),
  topPercent: ((i * 23 + 7) % 100),
  xOffset: ((i * 31 + 11) % 200) - 100,
  yOffset: ((i * 37 + 19) % 200) - 100,
  duration: 3 + (i % 3),
}));

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient && particleSeeds.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={false}
            animate={{
              x: mousePosition.x + particle.xOffset,
              y: mousePosition.y + particle.yOffset,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              left: `${particle.leftPercent}%`,
              top: `${particle.topPercent}%`,
            }}
          />
        ))}
      </div>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10"
      >
        <h1 className="text-2xl font-bold gradient-text">TRU Talk</h1>
        <div className="flex gap-4">
          <Link href="/download">
            <Button variant="outline">Download App</Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-background via-card to-background border border-border/50 p-8 md:p-16 shadow-2xl">
              {/* Pulsing Red Background Glow */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center mb-16"
                >
                  {/* Hero Logo */}
                  <div className="flex justify-center mb-6">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      src="/icons/trutalk-logo.png"
                      alt="TRU Talk"
                      className="h-32 md:h-40 lg:h-48 w-auto drop-shadow-2xl animate-pulse"
                    />
                  </div>

                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text leading-[1.1] font-display"
                  >
                    Voice-First Dating
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
                  >
                    Connect through authentic voice. AI-powered matching. Real-time translation across 50+ languages.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="flex flex-wrap gap-4 justify-center"
                  >
                    <Link href="/download">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="lg" className="text-lg px-10 py-7 h-auto shadow-lg hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-accent">
                          <Download className="mr-2" />
                          Download App
                        </Button>
                      </motion.div>
                    </Link>
                    <Link href="/features">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto hover:bg-primary/10 border-primary/30">
                          Learn More
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="grid md:grid-cols-3 gap-6"
                >
                  {[
                    {
                      img: '/icons/1.png',
                      title: 'Authentic Conversations',
                      description: 'Voice-first connections create deeper, more meaningful relationships.',
                      delay: 1.0,
                    },
                    {
                      img: '/icons/2.png',
                      title: 'Break Language Barriers',
                      description: 'Real-time voice translation lets you connect with anyone, anywhere.',
                      delay: 1.1,
                    },
                    {
                      img: '/icons/3.png',
                      title: 'Global Community',
                      description: 'Join thousands making cross-cultural connections daily.',
                      delay: 1.2,
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: feature.delay }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="rounded-2xl bg-card/50 backdrop-blur-sm p-8 flex flex-col items-center text-center cursor-pointer border border-primary/10 hover:border-primary/30 transition-all hover:bg-card/70 group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-24 h-24 mb-6"
                      >
                        <img
                          src={feature.img}
                          alt={feature.title}
                          className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                        />
                      </motion.div>
                      <h4 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="container mx-auto px-4 py-8 text-center text-muted-foreground relative z-10"
      >
        <p>&copy; 2025 TRU Talk. Breaking barriers through authentic conversations.</p>
      </motion.footer>
    </div>
  );
}


