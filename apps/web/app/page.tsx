const featureData = [
  {
    title: "Instant voice-first matching",
    copy: "Skip the swipe fatigue. Our signal engine listens for tone, pacing, and intent to pair you with someone who feels right now.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width="72" height="72">
        <path
          d="M10 34c0-7.18 5.82-13 13-13s13 5.82 13 13"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="23" cy="14" r="6" stroke="currentColor" strokeWidth="3" />
        <path
          d="M14 40h18M18 44h10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    )
  },
  {
    title: "Emotionally aware translation",
    copy: "Real-time translation that keeps laughter, warmth, and empathy intact across 50+ languages and dialects.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width="72" height="72">
        <path
          d="M12 10h24M24 10v6m0 0c-2.7 5.2-7.3 9.2-12.8 11.4M24 16c2.7 5.2 7.3 9.2 12.8 11.4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 36h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M16 36c0 3.314 2.686 6 6 6h4c3.314 0 6-2.686 6-6"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    )
  },
  {
    title: "Calm, safe calling space",
    copy: "Low-clutter controls, visible safety cues, and fast access to block/report keep every call grounded and respectful.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width="72" height="72">
        <path
          d="M12 14c0-1.657 1.343-3 3-3h18c1.657 0 3 1.343 3 3v14c0 1.657-1.343 3-3 3H15c-1.657 0-3-1.343-3-3V14Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M18 30h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M19 21h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M24 11v-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Signal-backed trust",
    copy: "Verified phone checks, emotion signals, and rapid human review keep bots and bad actors out of your lane.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" width="72" height="72">
        <path
          d="M11 18c0-4.418 3.582-8 8-8h10c4.418 0 8 3.582 8 8v4c0 8.284-6.716 15-15 15S11 30.284 11 22v-4Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M16 20v-4c0-1.657 1.343-3 3-3h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="23" r="4" stroke="currentColor" strokeWidth="3" />
        <path d="M24 27v4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="hero-shell">
        <div>
          <div className="brand-pill" aria-label="TruTalk brand promise">
            <span className="brand-dot" aria-hidden="true" />
            Voice-first. Emotionally intelligent.
          </div>
          <h1>Meet people by how they make you feel, not how they scroll.</h1>
          <p className="hero-subhead">
            TruTalk pairs you through tone, empathy, and pacing—so the first minute already feels like a trusted friend. Built
            for intentional, real conversations with safety baked in.
          </p>
          <div className="cta-row">
            <button className="btn-primary" aria-label="Join the TruTalk waitlist">
              Join the waitlist
            </button>
            <button className="btn-secondary" aria-label="See how it works">
              See how it works
            </button>
            <span className="badge" aria-label="Safety first badge">
              <span className="brand-dot" aria-hidden="true" />
              Safety first, always
            </span>
          </div>
        </div>
        <div className="signal-card" aria-label="Connection quality">
          <div className="stat-grid">
            <div className="signal-pill">
              <span className="muted">Avg call acceptance</span>
              <strong>82%</strong>
              <small className="muted">Within 45 seconds</small>
            </div>
            <div className="signal-pill">
              <span className="muted">Translation latency</span>
              <strong>220 ms</strong>
              <small className="muted">Across 50+ locales</small>
            </div>
            <div className="signal-pill">
              <span className="muted">Emotion clarity</span>
              <strong>95%</strong>
              <small className="muted">Tone + pacing signals</small>
            </div>
          </div>
          <div className="signal-pill">
            <span className="muted">Live now</span>
            <strong>4,820</strong>
            <small className="muted">People ready for a real chat</small>
          </div>
        </div>
      </section>

      <section className="feature-section" aria-labelledby="features-heading">
        <div className="section-header">
          <div>
            <h2 id="features-heading">Designed for calm, crystal-clear conversations</h2>
            <p>
              Every pixel is tuned for warmth and trust: centered iconography, generous spacing, and controls that keep your focus on
              the person you&apos;re talking to.
            </p>
          </div>
          <div className="badge" aria-label="Responsive and accessible">
            <span className="brand-dot" aria-hidden="true" />
            Responsive & accessible
          </div>
        </div>
        <div className="feature-grid">
          {featureData.map((feature) => (
            <article key={feature.title} className="feature-card">
              <div className="icon-wrap" data-testid="feature-icon" style={{ width: "104px", height: "104px" }}>
                {feature.icon}
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <p className="footer-note">Built for the 1:1 spark. Ready for millions.</p>
    </main>
  );
}
