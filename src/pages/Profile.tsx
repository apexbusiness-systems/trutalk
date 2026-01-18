import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  Crown,
  Flame,
  Globe,
  Heart,
  Mic,
  Settings,
  Sparkles,
  Trophy,
  Volume2,
  Zap
} from "lucide-react";

// Stats card component
function StatCard({ icon: Icon, label, value, gradient }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
      <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// Subscription tier badge
function TierBadge({ tier }: { tier: "free" | "premium" | "vip" }) {
  const configs = {
    free: { label: "Free", gradient: "from-slate-400 to-slate-600", icon: Sparkles },
    premium: { label: "Premium", gradient: "from-amber-400 to-orange-500", icon: Crown },
    vip: { label: "VIP", gradient: "from-violet-500 to-purple-600", icon: Zap },
  };
  const config = configs[tier];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.gradient} text-white font-semibold shadow-lg`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </div>
  );
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Mock user stats (would come from database)
  const stats = {
    streakCount: 7,
    totalCalls: 42,
    totalMinutes: 186,
    echoChips: 250,
    tier: "premium" as const,
    languages: ["English", "Spanish"],
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/match")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Match
        </Button>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile header */}
        <div className="text-center mb-8 animate-fade-in">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <Mic className="w-10 h-10 text-primary" />
              </div>
            </div>
            {/* Streak fire badge */}
            {stats.streakCount > 0 && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {stats.streakCount}
              </div>
            )}
          </div>

          {/* Name and email */}
          {isEditing ? (
            <div className="flex gap-2 justify-center mb-2">
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
                className="max-w-xs text-center"
              />
              <Button size="sm" onClick={() => setIsEditing(false)}>Save</Button>
            </div>
          ) : (
            <h2
              className="text-2xl font-bold text-foreground mb-1 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {displayName || user?.email?.split("@")[0] || "Anonymous Voice"}
            </h2>
          )}
          <p className="text-muted-foreground text-sm mb-3">{user?.email}</p>

          {/* Tier badge */}
          <TierBadge tier={stats.tier} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <StatCard
            icon={Flame}
            label="Day Streak"
            value={stats.streakCount}
            gradient="from-orange-500 to-red-500"
          />
          <StatCard
            icon={Heart}
            label="Connections"
            value={stats.totalCalls}
            gradient="from-pink-500 to-rose-500"
          />
          <StatCard
            icon={Volume2}
            label="Minutes Talked"
            value={stats.totalMinutes}
            gradient="from-teal-500 to-cyan-500"
          />
          <StatCard
            icon={Trophy}
            label="Echo Chips"
            value={stats.echoChips}
            gradient="from-amber-500 to-yellow-500"
          />
        </div>

        {/* Languages */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.languages.map((lang) => (
              <span key={lang} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                {lang}
              </span>
            ))}
            <button className="px-3 py-1 rounded-full border border-dashed border-border text-muted-foreground text-sm hover:border-primary hover:text-primary transition-colors">
              + Add
            </button>
          </div>
        </div>

        {/* Settings link */}
        <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Account Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
