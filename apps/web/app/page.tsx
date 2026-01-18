'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, Mic, Users, Download } from 'lucide-react';
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
                  <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text leading-[1.1] font-display"
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
                        <Button size="lg" className="text-lg px-10 py-7 h-auto shadow-lg hover:shadow-2xl transition-all">
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
                        <Button size="lg" variant="outline" className="text-lg px-10 py-7 h-auto">
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
                  className="grid md:grid-cols-3 gap-4"
                >
                  {[
                    {
                      icon: Globe,
                      title: 'Break Language Barriers',
                      description: 'Real-time voice translation lets you connect with anyone, anywhere.',
                      color: 'primary',
                      delay: 1.0,
                    },
                    {
                      icon: Mic,
                      title: 'Authentic Conversations',
                      description: 'Voice-first connections create deeper, more meaningful relationships.',
                      color: 'secondary',
                      delay: 1.1,
                    },
                    {
                      icon: Users,
                      title: 'Global Community',
                      description: 'Join thousands making cross-cultural connections daily.',
                      color: 'accent',
                      delay: 1.2,
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: feature.delay }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="rounded-2xl bg-muted/50 p-8 flex flex-col items-center text-center cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-24 h-24 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6`}
                      >
                        <feature.icon className={`w-12 h-12 text-${feature.color}`} />
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


