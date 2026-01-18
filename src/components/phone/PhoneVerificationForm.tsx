import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Loader2, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountryCodeSelector } from "./CountryCodeSelector";
import { countryCodes, type CountryCode } from "@/lib/country-codes";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PhoneVerificationFormProps {
  onVerified?: (userId: string, token: string) => void;
  apiBaseUrl?: string;
}

type Step = "phone" | "code" | "verified";

export function PhoneVerificationForm({
  onVerified,
  apiBaseUrl = "",
}: PhoneVerificationFormProps) {
  const [step, setStep] = useState<Step>("phone");
  const [country, setCountry] = useState<CountryCode>(
    countryCodes.find((c) => c.code === "US") || countryCodes[0]
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    return digits;
  };

  // Build full E.164 phone number
  const getFullPhoneNumber = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    return `${country.dial_code}${digits}`;
  };

  // Validate phone number (basic validation)
  const isValidPhone = () => {
    const digits = phoneNumber.replace(/\D/g, "");
    return digits.length >= 6 && digits.length <= 15;
  };

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Send verification code
  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidPhone()) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: getFullPhoneNumber() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      toast({
        title: "Code sent!",
        description: "Check your phone for the verification code.",
      });

      setStep("code");
      setResendCooldown(60);
      // Focus first code input
      setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send code";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle code input
  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = digit;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (digit && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace in code input
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste in code input
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...verificationCode];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setVerificationCode(newCode);
    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((c) => !c);
    codeInputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus();
  };

  // Verify code
  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();

    const code = verificationCode.join("");
    if (code.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter the 6-digit code.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: getFullPhoneNumber(),
          verification_code: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setStep("verified");
      toast({
        title: "Phone verified!",
        description: "Welcome to TRU Talk.",
      });

      onVerified?.(data.user_id, data.token);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      // Clear code on error
      setVerificationCode(["", "", "", "", "", ""]);
      codeInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: getFullPhoneNumber() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      toast({
        title: "Code resent!",
        description: "Check your phone for the new code.",
      });

      setResendCooldown(60);
      setVerificationCode(["", "", "", "", "", ""]);
      codeInputRefs.current[0]?.focus();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to resend code";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {/* Step 1: Phone Number Entry */}
        {step === "phone" && (
          <motion.form
            key="phone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSendCode}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Enter your phone</h2>
              <p className="text-muted-foreground">
                We'll send you a verification code
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone input with country selector */}
              <div className="flex">
                <CountryCodeSelector
                  value={country}
                  onChange={setCountry}
                  disabled={loading}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  disabled={loading}
                  className={cn(
                    "flex-1 h-12 px-4 rounded-r-lg border border-input bg-background",
                    "text-foreground text-lg placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                />
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to receive SMS verification. 
                Standard rates may apply.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base font-semibold"
              disabled={loading || !isValidPhone()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.form>
        )}

        {/* Step 2: Code Verification */}
        {step === "code" && (
          <motion.form
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleVerifyCode}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Enter verification code</h2>
              <p className="text-muted-foreground">
                Sent to {country.flag} {getFullPhoneNumber()}
              </p>
            </div>

            <div className="space-y-4">
              {/* 6-digit code input */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (codeInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    onPaste={handleCodePaste}
                    disabled={loading}
                    className={cn(
                      "w-11 h-14 sm:w-12 sm:h-16 rounded-lg border-2 border-input bg-background",
                      "text-center text-2xl font-bold text-foreground",
                      "focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-200",
                      digit && "border-primary/50"
                    )}
                  />
                ))}
              </div>

              {/* Resend button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading || resendCooldown > 0}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-medium",
                    resendCooldown > 0
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary hover:text-primary/80"
                  )}
                >
                  <RefreshCw className="w-4 h-4" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold"
                disabled={loading || verificationCode.join("").length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={() => {
                  setStep("phone");
                  setVerificationCode(["", "", "", "", "", ""]);
                }}
                disabled={loading}
              >
                Change phone number
              </Button>
            </div>
          </motion.form>
        )}

        {/* Step 3: Verified */}
        {step === "verified" && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground">You're verified!</h2>
            <p className="text-muted-foreground">
              Welcome to TRU Talk. Let's find your voice.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
