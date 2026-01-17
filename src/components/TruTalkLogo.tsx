import { SVGProps } from "react";

interface TruTalkLogoProps extends SVGProps<SVGSVGElement> {
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
}

const sizeMap = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 280, height: 90 },
    xl: { width: 400, height: 130 },
};

export function TruTalkLogo({
    size = "md",
    showText = true,
    className = "",
    ...props
}: TruTalkLogoProps) {
    const { width, height } = sizeMap[size];

    return (
        <svg
            viewBox="0 0 400 130"
            width={width}
            height={height}
            className={className}
            {...props}
        >
            {/* Gradient Definitions */}
            <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
                <filter id="heartGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Heart with embedded heartbeat */}
            <g filter="url(#heartGlow)" transform="translate(10, 15)">
                {/* Heart shape */}
                <path
                    d="M50 95 C50 95, 5 55, 5 35 C5 15, 25 5, 50 25 C75 5, 95 15, 95 35 C95 55, 50 95, 50 95 Z"
                    fill="url(#heartGradient)"
                />
                {/* Heartbeat line across the heart */}
                <path
                    d="M15 45 L30 45 L35 35 L42 55 L50 30 L58 55 L65 40 L70 45 L85 45"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>

            {/* TRU TALK Text */}
            {showText && (
                <g>
                    {/* TRU */}
                    <text
                        x="120"
                        y="65"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fontSize="48"
                        fontWeight="800"
                        fill="url(#textGradient)"
                        letterSpacing="-1"
                    >
                        TRU
                    </text>
                    {/* TALK */}
                    <text
                        x="120"
                        y="108"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fontSize="48"
                        fontWeight="800"
                        fill="url(#textGradient)"
                        letterSpacing="-1"
                    >
                        TALK
                    </text>
                </g>
            )}
        </svg>
    );
}

// Compact version for headers
export function TruTalkLogoCompact({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg viewBox="0 0 40 40" width="32" height="32">
                <defs>
                    <linearGradient id="heartGradientSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
                <path
                    d="M20 36 C20 36, 2 22, 2 12 C2 4, 10 0, 20 8 C30 0, 38 4, 38 12 C38 22, 20 36, 20 36 Z"
                    fill="url(#heartGradientSmall)"
                />
                <path
                    d="M6 16 L12 16 L14 12 L17 20 L20 10 L23 20 L26 14 L28 16 L34 16"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                TRU Talk
            </span>
        </div>
    );
}
