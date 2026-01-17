import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { User } from "@supabase/supabase-js";

// Supported languages for i18n (subset of DeepL supported)
const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
] as const;

interface HeaderProps {
    transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<typeof LANGUAGES[number]>(LANGUAGES[0]);
    const navigate = useNavigate();

    useEffect(() => {
        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setMobileMenuOpen(false);
        navigate("/");
    };

    const handleLanguageChange = (lang: typeof LANGUAGES[number]) => {
        setCurrentLang(lang);
        setLangMenuOpen(false);
        // Store preference
        localStorage.setItem("trutalk_lang", lang.code);
        // In a full implementation, this would trigger i18n context update
    };

    return (
        <header className={`relative z-50 ${transparent ? "" : "bg-background/95 backdrop-blur-sm border-b border-border/50"}`}>
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
                        <img
                            src="/icons/trutalk-logo.png"
                            alt="TRU Talk"
                            className="h-8 md:h-10 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Dashboard
                        </Link>
                        <Link to="/match" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Match
                        </Link>
                        <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Profile
                        </Link>
                    </nav>

                    {/* Right side: Language + Auth */}
                    <div className="flex items-center gap-2">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 transition-colors"
                                aria-label="Select language"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="hidden sm:inline">{currentLang.flag}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Language Dropdown */}
                            {langMenuOpen && (
                                <>
                                    <div className="fixed inset-0" onClick={() => setLangMenuOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-scale-in">
                                        <div className="p-1 max-h-64 overflow-y-auto">
                                            {LANGUAGES.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${currentLang.code === lang.code
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        }`}
                                                >
                                                    <span>{lang.flag}</span>
                                                    <span>{lang.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Auth Button - Desktop */}
                        <div className="hidden md:block">
                            {user ? (
                                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            ) : (
                                <Link to="/auth">
                                    <Button variant="outline" size="sm" className="border-primary/50 hover:bg-primary/10">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute left-0 right-0 top-full bg-background border-b border-border shadow-xl animate-fade-in">
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                            <Link
                                to="/"
                                className="px-4 py-3 rounded-lg text-foreground hover:bg-card transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className="px-4 py-3 rounded-lg text-foreground hover:bg-card transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/match"
                                className="px-4 py-3 rounded-lg text-foreground hover:bg-card transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Match
                            </Link>
                            <Link
                                to="/profile"
                                className="px-4 py-3 rounded-lg text-foreground hover:bg-card transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <hr className="border-border my-2" />
                            {user ? (
                                <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            ) : (
                                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full">Sign In</Button>
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
