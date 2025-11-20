import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruTalk | Voice-First Connections",
  description: "A premium, voice-first way to meet people you truly vibe with."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
