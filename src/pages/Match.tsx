import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, Sparkles, Heart, Volume2 } from "lucide-react";

// Emotion mapping for visual feedback - TruTalk Red/Rose Theme
const EMOTION_COLORS = {
  lonely: { from: "from-rose-600", to: "to-rose-800", glow: "shadow-rose-600/50" },
  happy: { from: "from-red-400", to: "to-orange-500", glow: "shadow-red-400/50" },
  excited: { from: "from-rose-500", to: "to-pink-600", glow: "shadow-rose-500/50" },
  calm: { from: "from-rose-300", to: "to-pink-400", glow: "shadow-rose-300/50" },
  romantic: { from: "from-red-500", to: "to-rose-600", glow: "shadow-red-500/50" },
  playful: { from: "from-pink-400", to: "to-rose-500", glow: "shadow-pink-400/50" },
};

// Audio-reactive waveform visualizer
function AudioReactiveWaveform({ audioLevel, isRecording }: { audioLevel: number; isRecording: boolean }) {
  const bars = 16;
  return (
    <div className="flex items-end justify-center gap-1 h-20">
      {[...Array(bars)].map((_, i) => {
        // Create wave effect based on audio level and position
        const centerDistance = Math.abs(i - bars / 2) / (bars / 2);
        const height = isRecording
          ? Math.max(8, audioLevel * (1 - centerDistance * 0.5) * 80 + Math.sin(Date.now() / 100 + i) * 10)
          : 8;
        return (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-primary via-accent to-primary transition-all duration-75"
            style={{
              height: `${height}px`,
              opacity: isRecording ? 0.8 + audioLevel * 0.2 : 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

// Audio-reactive background glow
function AudioReactiveGlow({ audioLevel, isRecording }: { audioLevel: number; isRecording: boolean }) {
  const glowSize = isRecording ? 300 + audioLevel * 200 : 200;
  const glowOpacity = isRecording ? 0.3 + audioLevel * 0.4 : 0.1;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Central pulsing glow that reacts to audio */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-3xl transition-all duration-100"
        style={{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          opacity: glowOpacity,
        }}
      />
      {/* Outer ring glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent blur-3xl transition-all duration-150"
        style={{
          width: `${glowSize * 1.5}px`,
          height: `${glowSize * 1.5}px`,
          opacity: glowOpacity * 0.5,
        }}
      />
      {/* Ambient corner glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

export default function Match() {
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [matchState, setMatchState] = useState<"idle" | "recording" | "processing" | "matched">("idle");
  const [detectedEmotion, setDetectedEmotion] = useState<keyof typeof EMOTION_COLORS | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const navigate = useNavigate();

  // Audio context refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
      // Cleanup audio
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [navigate]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            handleStopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, handleStopRecording]);

  // Audio level analyzer
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average audio level (0-1)
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    setAudioLevel(average / 255);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Set up Web Audio API for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Start analyzing
      analyzeAudio();

      setIsRecording(true);
      setMatchState("recording");
      setRecordingTime(0);

      // Simulated emotion detection after 3 seconds
      setTimeout(() => {
        const emotions = Object.keys(EMOTION_COLORS) as (keyof typeof EMOTION_COLORS)[];
        setDetectedEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
      }, 3000);
    } catch (error) {
      console.error("Failed to access microphone:", error);
    }
  }, [analyzeAudio]);

  const handleStopRecording = useCallback(() => {
    // Stop audio analysis
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsRecording(false);
    setAudioLevel(0);
    setMatchState("processing");

    // Simulate processing
    setTimeout(() => {
      setMatchState("matched");
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
    );
  }

  const emotionColors = detectedEmotion ? EMOTION_COLORS[detectedEmotion] : null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Audio-reactive pulsing background */}
      <AudioReactiveGlow audioLevel={audioLevel} isRecording={isRecording} />

      <Header />

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        {/* Status text */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            {matchState === "idle" && "Express Yourself"}
            {matchState === "recording" && "We're Listening..."}
            {matchState === "processing" && "Finding Your Match"}
            {matchState === "matched" && "Connection Found!"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {matchState === "idle" && "Share your voice to find an emotional connection"}
            {matchState === "recording" && `${30 - recordingTime}s remaining`}
            {matchState === "processing" && "Analyzing your emotions..."}
            {matchState === "matched" && "Someone resonates with your frequency"}
          </p>
        </div>

        {/* Voice recording orb */}
        <div className="relative mb-8">
          {/* Outer audio-reactive glow rings */}
          {isRecording && (
            <>
              <div
                className="absolute inset-0 rounded-full bg-primary/30 blur-xl transition-all duration-100"
                style={{
                  transform: `scale(${1.5 + audioLevel * 0.5})`,
                  opacity: 0.3 + audioLevel * 0.3,
                }}
              />
              <div
                className="absolute inset-0 rounded-full bg-accent/20 blur-2xl transition-all duration-150"
                style={{
                  transform: `scale(${2 + audioLevel * 0.8})`,
                  opacity: 0.2 + audioLevel * 0.2,
                }}
              />
            </>
          )}

          {/* Main recording button */}
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={matchState === "processing" || matchState === "matched"}
            className={`
              relative w-40 h-40 md:w-48 md:h-48 rounded-full 
              flex items-center justify-center
              transition-all duration-300 ease-out
              ${isRecording
                ? `bg-gradient-to-br ${emotionColors?.from || "from-primary"} ${emotionColors?.to || "to-accent"}`
                : "bg-gradient-to-br from-muted to-muted/50 hover:from-primary/20 hover:to-accent/20 hover:scale-105"
              }
              ${matchState === "processing" ? "animate-pulse" : ""}
              ${matchState === "matched" ? "bg-gradient-to-br from-accent to-primary" : ""}
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-2xl
            `}
            style={{
              transform: isRecording ? `scale(${1 + audioLevel * 0.1})` : undefined,
            }}
          >
            {/* Inner circle */}
            <div className="absolute inset-4 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
              {matchState === "idle" && <Mic className="w-12 h-12 md:w-16 md:h-16 text-primary" />}
              {matchState === "recording" && <MicOff className="w-12 h-12 md:w-16 md:h-16 text-destructive" />}
              {matchState === "processing" && <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-accent animate-spin" />}
              {matchState === "matched" && <Heart className="w-12 h-12 md:w-16 md:h-16 text-pink-500 animate-pulse" />}
            </div>
          </button>
        </div>

        {/* Audio-reactive waveform visualizer */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <AudioReactiveWaveform audioLevel={audioLevel} isRecording={isRecording} />
        </div>

        {/* Detected emotion badge */}
        {detectedEmotion && matchState !== "idle" && (
          <div
            className={`
              px-6 py-3 rounded-full 
              bg-gradient-to-r ${emotionColors?.from} ${emotionColors?.to}
              text-white font-semibold text-lg
              animate-scale-in shadow-lg ${emotionColors?.glow}
            `}
          >
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Feeling {detectedEmotion.charAt(0).toUpperCase() + detectedEmotion.slice(1)}
            </div>
          </div>
        )}

        {/* Match found action */}
        {matchState === "matched" && (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              className="px-12 py-6 h-auto text-lg bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              Start Voice Call
            </Button>
          </div>
        )}

        {/* Instructions */}
        {matchState === "idle" && (
          <div className="mt-8 text-center text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <p className="text-sm">Tap the orb and speak for 5-30 seconds</p>
            <p className="text-xs mt-1 opacity-60">Your voice reveals your emotional frequency</p>
          </div>
        )}
      </main>
    </div>
  );
}
