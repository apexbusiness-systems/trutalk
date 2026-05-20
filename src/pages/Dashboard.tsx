import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
    Crown,
    Flame,
    Heart,
    Mic,
    Sparkles,
    Trophy,
    Volume2,
    Zap,
    Lock,
    Globe,
    Clock,
    TrendingUp,
    MessageCircle,
    Gift
} from "lucide-react";

// Stats card component
function StatCard({ icon: Icon, label, value, gradient, premium = false }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    gradient: string;
    premium?: boolean;
}) {
    return (
        <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
            <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    {premium && (
                        <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" /> PRO
                        </span>
                    )}
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}

// Recent match card
function MatchCard({ name, emotion, time, premium = false }: {
    name: string;
    emotion: string;
    time: string;
    premium?: boolean;
}) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-card/30 border border-border/50 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{name}</p>
                <p className="text-sm text-muted-foreground">Feeling {emotion}</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground">{time}</p>
                {premium ? (
                    <Button size="sm" variant="outline" className="mt-1 text-xs border-amber-500/50 text-amber-500">
                        <Lock className="w-3 h-3 mr-1" /> Unlock
                    </Button>
                ) : (
                    <Button size="sm" className="mt-1 text-xs">
                        <Volume2 className="w-3 h-3 mr-1" /> Call
                    </Button>
                )}
            </div>
        </div>
    );
}

// Premium feature card
function PremiumFeatureCard({ icon: Icon, title, description, locked = true }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    locked?: boolean;
}) {
    return (
        <div className={`relative p-5 rounded-2xl border transition-all ${locked
            ? "bg-card/30 border-amber-500/20 hover:border-amber-500/40"
            : "bg-card/50 border-primary/20 hover:border-primary/40"
            }`}>
            {locked && (
                <div className="absolute top-3 right-3">
                    <Lock className="w-4 h-4 text-amber-500" />
                </div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${locked
                ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                : "bg-gradient-to-br from-primary/20 to-accent/20"
                }`}>
                <Icon className={`w-6 h-6 ${locked ? "text-amber-500" : "text-primary"}`} />
            </div>
            <h4 className="font-semibold text-foreground mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
}



type DashboardStats = {
    streakCount: number;
    totalMatches: number;
    totalMinutes: number;
    echoChips: number;
    weeklyGrowth: number;
    tier: "free" | "premium" | "vip";
};

type UserMetricsRow = {
    streak_count: number | null;
    total_minutes: number | null;
    echo_chips: number | null;
    subscription_tier: "free" | "premium" | "vip" | null;
};

type RecentMatchRow = {
    id: string;
    created_at: string;
    status: string | null;
    similarity_score: number | null;
};

type WeeklyCallRow = {
    created_at: string;
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [stats, setStats] = useState<DashboardStats>({
        streakCount: 7,
        totalMatches: 0,
        totalMinutes: 0,
        echoChips: 0,
        weeklyGrowth: 0,
        tier: "free" as const,
    });

    const [recentMatches, setRecentMatches] = useState<Array<{ name: string; emotion: string; time: string; premium: boolean }>>([]);
    const [weeklyBars, setWeeklyBars] = useState<number[]>([5, 5, 5, 5, 5, 5, 5]);

    const formatRelativeTime = (isoDate: string) => {
        const diffMs = Date.now() - new Date(isoDate).getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        if (hours < 1) return "just now";
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    useEffect(() => {
        const fetchDashboardData = async (userId: string) => {
            const db = supabase as any; // generated root types are incomplete, so use runtime query client with explicit row typing here.
            setError(null);

            const [userResult, totalMatchesResult, recentMatchesResult, weeklyCallsResult, previousWeeklyCallsResult] = await Promise.all([
                db.from("users").select("streak_count,total_minutes,echo_chips,subscription_tier").eq("id", userId).single(),
                db
                    .from("matches")
                    .select("id", { count: "exact", head: true })
                    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`),
                db
                    .from("matches")
                    .select("id,created_at,status,similarity_score")
                    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
                    .order("created_at", { ascending: false })
                    .limit(4),
                db
                    .from("calls")
                    .select("created_at,duration_seconds")
                    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
                    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
                db
                    .from("calls")
                    .select("id", { count: "exact", head: true })
                    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
                    .gte("created_at", new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
                    .lt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
            ]);

            if (userResult.error || totalMatchesResult.error || recentMatchesResult.error || weeklyCallsResult.error || previousWeeklyCallsResult.error) {
                setError("Unable to load live dashboard metrics right now.");
                return;
            }

            const user = userResult.data as UserMetricsRow | null;
            const matches = (recentMatchesResult.data ?? []) as RecentMatchRow[];
            const totalMatches = totalMatchesResult.count ?? 0;
            const weeklyCalls = (weeklyCallsResult.data ?? []) as WeeklyCallRow[];
            const previousWeekCount = previousWeeklyCallsResult.count ?? 0;

            const weekByDay = Array(7).fill(0);
            weeklyCalls.forEach((call) => {
                const dayIndex = (new Date(call.created_at).getDay() + 6) % 7;
                weekByDay[dayIndex] += 1;
            });

            const maxDayCalls = Math.max(...weekByDay, 1);
            setWeeklyBars(weekByDay.map((dayCount) => Math.max(8, Math.round((dayCount / maxDayCalls) * 100))));

            setStats({
                streakCount: user?.streak_count ?? 0,
                totalMatches,
                totalMinutes: user?.total_minutes ?? 0,
                echoChips: user?.echo_chips ?? 0,
                weeklyGrowth: previousWeekCount === 0 ? (weeklyCalls.length > 0 ? 100 : 0) : Math.round(((weeklyCalls.length - previousWeekCount) / previousWeekCount) * 100),
                tier: (user?.subscription_tier as "free" | "premium" | "vip" | null) ?? "free",
            });

            setRecentMatches(matches.map((match) => ({
                name: `Voice Echo #${match.id.slice(0, 4)}`,
                emotion: match.status ?? "Unknown",
                time: formatRelativeTime(match.created_at),
                premium: (match.similarity_score ?? 0) < 0.75 && (user?.subscription_tier ?? "free") === "free",
            })));
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                setLoading(false);
                navigate("/auth");
                return;
            }

            fetchDashboardData(session.user.id).finally(() => setLoading(false));
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) {
                setLoading(false);
                navigate("/auth");
                return;
            }

            fetchDashboardData(session.user.id).finally(() => setLoading(false));
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

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

    return (
        <div className="min-h-screen bg-background">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <Header />

            <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Your voice is making connections. Keep the momentum going!
                    </p>
                </div>

                {/* Quick Action */}
                <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <Link to="/match">
                        <div className="relative rounded-2xl bg-gradient-to-r from-primary to-accent p-6 text-white overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Ready to Connect?</h2>
                                    <p className="text-white/80 text-sm">Record your voice and find your match</p>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                    <Mic className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <StatCard
                        icon={Flame}
                        label="Day Streak"
                        value={stats.streakCount}
                        gradient="from-orange-500 to-red-500"
                    />
                    <StatCard
                        icon={Heart}
                        label="Total Matches"
                        value={stats.totalMatches}
                        gradient="from-pink-500 to-rose-500"
                    />
                    <StatCard
                        icon={Clock}
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

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Matches */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Recent Matches</h3>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                View All
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {recentMatches.length === 0 && (
                                <div className="p-4 rounded-xl bg-card/30 border border-border/50 text-sm text-muted-foreground">
                                    No recent matches yet. Record your voice to get matched.
                                </div>
                            )}
                            {recentMatches.map((match, i) => (
                                <MatchCard key={i} {...match} />
                            ))}
                        </div>
                    </div>

                    {/* Premium Features */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-500" />
                                Premium Features
                            </h3>
                            <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                <Zap className="w-4 h-4 mr-1" /> Upgrade
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <PremiumFeatureCard
                                icon={Globe}
                                title="Priority Translation"
                                description="Faster, higher-quality translations"
                                locked={true}
                            />
                            <PremiumFeatureCard
                                icon={TrendingUp}
                                title="Match Insights"
                                description="See who viewed your profile"
                                locked={true}
                            />
                            <PremiumFeatureCard
                                icon={MessageCircle}
                                title="Unlimited Messages"
                                description="No daily message limits"
                                locked={true}
                            />
                            <PremiumFeatureCard
                                icon={Gift}
                                title="Daily Boosts"
                                description="Get more visibility"
                                locked={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Weekly Stats */}
                <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="bg-card/30 border border-border/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-foreground">This Week</h3>
                            <span className="flex items-center gap-1 text-sm text-green-500">
                                <TrendingUp className="w-4 h-4" />
                                {stats.weeklyGrowth > 0 ? "+" : ""}{stats.weeklyGrowth}%
                            </span>
                        </div>
                        {error && <p className="text-xs text-destructive mb-2">{error}</p>}
                        <div className="flex items-end gap-2 h-24">
                            {weeklyBars.map((height, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:opacity-80"
                                    style={{ height: `${height}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
