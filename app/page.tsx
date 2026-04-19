"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f2ee;
          color: #1a1a1a;
          min-height: 100vh;
        }

        .land-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid #e8e4de;
          background: #f4f2ee;
        }

        .land-wordmark {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .land-wordmark-icon {
          width: 30px; height: 30px;
          background: #1a1a1a;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        .land-nav-badge {
          font-size: 11px;
          font-weight: 600;
          background: #1a1a1a;
          color: #fff;
          padding: 5px 12px;
          border-radius: 20px;
          font-family: 'DM Mono', monospace;
        }

        /* Hero */
        .land-hero {
          max-width: 760px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          text-align: center;
        }

        .land-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #888;
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 20px;
          padding: 5px 14px;
          margin-bottom: 28px;
          font-family: 'DM Mono', monospace;
        }

        .land-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .land-h1 {
          font-size: 56px;
          font-weight: 800;
          letter-spacing: -2.5px;
          line-height: 1.05;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .land-h1 span {
          display: inline-block;
          background: #1a1a1a;
          color: #f4f2ee;
          border-radius: 12px;
          padding: 0 12px;
        }

        .land-sub {
          font-size: 17px;
          color: #666;
          line-height: 1.6;
          max-width: 500px;
          margin: 0 auto 40px;
        }

        .land-cta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .land-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 13px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.15s;
        }
        .land-btn-primary:hover { opacity: 0.85; }

        .land-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          color: #1a1a1a;
          font-size: 14px;
          font-weight: 600;
          padding: 13px 24px;
          border-radius: 12px;
          border: 1px solid #e8e4de;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s;
        }
        .land-btn-secondary:hover { background: #f0ede8; }

        /* Stats strip */
        .land-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          padding: 32px 24px;
          border-top: 1px solid #e8e4de;
          border-bottom: 1px solid #e8e4de;
          background: #fff;
          flex-wrap: wrap;
        }

        .land-stat-item { text-align: center; }
        .land-stat-num {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #1a1a1a;
        }
        .land-stat-label {
          font-size: 12px;
          color: #aaa;
          margin-top: 2px;
          font-family: 'DM Mono', monospace;
        }

        /* Campus cards */
        .land-campuses {
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }

        .land-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 20px;
          font-family: 'DM Mono', monospace;
        }

        .land-campus-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .land-campus-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: border-color 0.15s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }
        .land-campus-card:hover {
          border-color: #1a1a1a;
          transform: translateY(-1px);
        }
        .land-campus-card.active {
          border-color: #1a1a1a;
          border-width: 2px;
        }
        .land-campus-card.inactive {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .land-campus-card.inactive:hover {
          border-color: #e8e4de;
          transform: none;
        }

        .land-campus-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .land-campus-icon {
          width: 40px; height: 40px;
          background: #f4f2ee;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }

        .land-campus-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
          font-family: 'DM Mono', monospace;
        }
        .land-campus-badge.live { background: #dcfce7; color: #16a34a; }
        .land-campus-badge.soon { background: #f3f4f6; color: #aaa; }

        .land-campus-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .land-campus-sub {
          font-size: 12px;
          color: #aaa;
          font-family: 'DM Mono', monospace;
        }

        .land-campus-rooms {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 12px;
          color: #555;
          font-weight: 500;
        }

        .land-room-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }
        .land-room-dot.green { background: #22c55e; }
        .land-room-dot.gray  { background: #e0e0e0; }

        /* How it works */
        .land-how {
          background: #1a1a1a;
          padding: 64px 24px;
        }

        .land-how-inner {
          max-width: 760px;
          margin: 0 auto;
        }

        .land-how-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 12px;
          font-family: 'DM Mono', monospace;
        }

        .land-how-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1px;
          color: #fff;
          margin-bottom: 40px;
        }

        .land-steps {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }

        .land-step {
          padding: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
        }

        .land-step-num {
          font-size: 11px;
          font-weight: 600;
          color: #444;
          font-family: 'DM Mono', monospace;
          margin-bottom: 12px;
        }

        .land-step-title {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }

        .land-step-body {
          font-size: 13px;
          color: #666;
          line-height: 1.6;
        }

        /* Footer */
        .land-footer {
          padding: 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #e8e4de;
        }

        .land-footer-left {
          font-size: 12px;
          color: #aaa;
          font-family: 'DM Mono', monospace;
        }

        .land-footer-right {
          font-size: 12px;
          color: #aaa;
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      {/* Nav */}
      <nav className="land-nav">
        <div className="land-wordmark">
          <div className="land-wordmark-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="4" fill="white" />
              <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          RoomGuard
        </div>
        <div className="land-nav-badge">StarkHacks 2026</div>
      </nav>

      {/* Hero */}
      <section className="land-hero">
        <div className="land-eyebrow">
          <div className="land-eyebrow-dot" />
          Live sensor data · ESP32-S3
        </div>
        <h1 className="land-h1">
          Stop ghost
          <br />
          <span>reservations</span>
        </h1>
        <p className="land-sub">
          RoomGuard uses hardware sensors to detect real occupancy — and
          automatically frees study rooms when nobody's there.
        </p>
        <div className="land-cta-row">
          <button
            className="land-btn-primary"
            onClick={() => router.push("/campus")}
          >
            View Purdue rooms →
          </button>
          <button
            className="land-btn-secondary"
            onClick={() => router.push("/room")}
          >
            Live sensor feed
          </button>
        </div>
      </section>

      {/* Stats strip */}
      <div className="land-stats">
        <div className="land-stat-item">
          <div className="land-stat-num">~$8</div>
          <div className="land-stat-label">hardware cost</div>
        </div>
        <div className="land-stat-item">
          <div className="land-stat-num">2s</div>
          <div className="land-stat-label">update interval</div>
        </div>
        <div className="land-stat-item">
          <div className="land-stat-num">15 min</div>
          <div className="land-stat-label">auto-release threshold</div>
        </div>
        <div className="land-stat-item">
          <div className="land-stat-num">$50k+</div>
          <div className="land-stat-label">enterprise alternatives</div>
        </div>
      </div>

      {/* Campus cards */}
      <section className="land-campuses">
        <div className="land-section-label">Select your campus</div>
        <div className="land-campus-grid">
          <div
            className="land-campus-card active"
            onClick={() => router.push("/campus")}
          >
            <div className="land-campus-top">
              <div className="land-campus-icon">🚂</div>
              <div className="land-campus-badge live">Live</div>
            </div>
            <div className="land-campus-name">Purdue University</div>
            <div className="land-campus-sub">West Lafayette, IN</div>
            <div className="land-campus-rooms">
              <div className="land-room-dot green" />
              <div className="land-room-dot green" />
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              &nbsp;2 of 5 rooms monitored
            </div>
          </div>

          <div className="land-campus-card inactive">
            <div className="land-campus-top">
              <div className="land-campus-icon">🌊</div>
              <div className="land-campus-badge soon">Coming soon</div>
            </div>
            <div className="land-campus-name">UC San Diego</div>
            <div className="land-campus-sub">La Jolla, CA</div>
            <div className="land-campus-rooms">
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              &nbsp;Deployment pending
            </div>
          </div>

          <div className="land-campus-card inactive">
            <div className="land-campus-top">
              <div className="land-campus-icon">🌳</div>
              <div className="land-campus-badge soon">Coming soon</div>
            </div>
            <div className="land-campus-name">Stanford University</div>
            <div className="land-campus-sub">Palo Alto, CA</div>
            <div className="land-campus-rooms">
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              &nbsp;Deployment pending
            </div>
          </div>

          <div className="land-campus-card inactive">
            <div className="land-campus-top">
              <div className="land-campus-icon">🦫</div>
              <div className="land-campus-badge soon">Coming soon</div>
            </div>
            <div className="land-campus-name">MIT</div>
            <div className="land-campus-sub">Cambridge, MA</div>
            <div className="land-campus-rooms">
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              <div className="land-room-dot gray" />
              &nbsp;Deployment pending
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="land-how">
        <div className="land-how-inner">
          <div className="land-how-label">How it works</div>
          <div className="land-how-title">Hardware meets software</div>
          <div className="land-steps">
            <div className="land-step">
              <div className="land-step-num">01</div>
              <div className="land-step-title">Sensor detects presence</div>
              <div className="land-step-body">
                An ESP32-S3 with ultrasonic + vibration sensors checks the room
                every 2 seconds.
              </div>
            </div>
            <div className="land-step">
              <div className="land-step-num">02</div>
              <div className="land-step-title">Data hits the cloud</div>
              <div className="land-step-body">
                Readings are posted to a Next.js API on Vercel and logged to
                PostgreSQL in real time.
              </div>
            </div>
            <div className="land-step">
              <div className="land-step-num">03</div>
              <div className="land-step-title">Room auto-releases</div>
              <div className="land-step-body">
                If nobody's detected for 15 minutes, the reservation is flagged
                for cancellation.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="land-footer">
        <div className="land-footer-left">RoomGuard · StarkHacks 2026</div>
        <div className="land-footer-right">
          Built with ESP32 · Next.js · Neon
        </div>
      </footer>
    </>
  );
}
