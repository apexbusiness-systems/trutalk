import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneVerificationForm } from "@/components/phone";

export default function PhoneAuth() {
  const navigate = useNavigate();

  const handleVerified = (userId: string, token: string) => {
    // Store token and redirect to main app
    localStorage.setItem("trutalk_token", token);
    localStorage.setItem("trutalk_user_id", userId);
    
    // Redirect after a short delay for the success animation
    setTimeout(() => {
      navigate("/match");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <span className="font-semibold text-foreground">TRU Talk</span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Decorative background glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
          </div>

          {/* Card container */}
          <div className="relative z-10 bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 shadow-2xl">
            <PhoneVerificationForm
              onVerified={handleVerified}
              apiBaseUrl={import.meta.env.VITE_API_BASE_URL || ""}
            />
          </div>

          {/* Alternative login option */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-primary hover:underline font-medium"
            >
              Sign in with email
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
