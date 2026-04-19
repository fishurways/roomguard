"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SensorResponse {
  occupied: boolean;
  distance: number | null;
  vibrating: boolean;
}

export default function LandingPage() {
  const router = useRouter();
  const [time, setTime] = useState("");
  const [sensor, setSensor] = useState<SensorResponse | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const res = await fetch("/api/sensor");
        if (res.ok) setSensor(await res.json());
      } catch {}
    };
    fetchSensor();
    const id = setInterval(fetchSensor, 2000);
    return () => clearInterval(id);
  }, []);

  const sensorStatus =
    sensor === null
      ? "Connecting…"
      : sensor.occupied
        ? `Occupied · ${sensor.distance}cm`
        : `Vacant · ${sensor.distance}cm`;

  const sensorColor =
    sensor === null ? "#999" : sensor.occupied ? "#c87137" : "#1a4d1a";

  const sensorBg =
    sensor === null ? "#f3f4f6" : sensor.occupied ? "#fef3c7" : "#d4f5d4";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'Inter', sans-serif;
          background: #f4f2ee;
          color: #1a1a1a;
          min-height: 100vh;
        }

        /* Nav */
        .ed-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          max-width: 1200px;
          margin: 0 auto;
        }
        .ed-wordmark {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .ed-wordmark::before {
          content: '';
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #1a1a1a;
          display: inline-block;
        }
        .ed-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #888;
          letter-spacing: 0.5px;
          display: flex;
          gap: 20px;
        }
        .ed-meta .dot { color: #22c55e; }

        .ed-wrap { max-width: 1200px; margin: 0 auto; }

        /* Hero */
        .ed-hero-wrap {
          position: relative;
          padding: 16px 32px 0;
        }
        .ed-hero {
          position: relative;
          height: 420px;
          overflow: hidden;
          border-radius: 20px;
          background: #8b5a2b;
        }
        .ed-hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          filter: saturate(1.05) contrast(1.02);
        }
        .ed-hero-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%);
        }
        .ed-hero-tag {
          position: absolute;
          top: 20px; left: 20px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(8px);
          padding: 7px 14px;
          border-radius: 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .ed-hero-tag::before {
          content: '';
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .ed-hero-caption {
          position: absolute;
          bottom: 28px; left: 28px; right: 28px;
          color: #fff;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .ed-hero-location {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 6px;
        }
        .ed-hero-campus {
          font-family: 'Fraunces', serif;
          font-size: 36px;
          font-weight: 500;
          letter-spacing: -1px;
          line-height: 1;
        }
        .ed-hero-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          text-align: right;
          opacity: 0.85;
          line-height: 1.7;
        }

        /* Floating sensor card */
        .ed-float {
          position: absolute;
          right: 56px;
          bottom: -44px;
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 10;
          min-width: 220px;
        }
        .ed-float-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          transition: background 0.3s;
        }
        .ed-float-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .ed-float-value {
          font-family: 'Fraunces', serif;
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.3px;
          transition: color 0.3s;
        }
        .ed-float-detail {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #bbb;
          margin-top: 2px;
        }

        /* Main section */
        .ed-main { padding: 80px 32px 40px; }

        .ed-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 48px;
          margin-bottom: 48px;
        }
        .ed-issue {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ed-issue::before {
          content: '';
          height: 1px; background: #d0cdc5;
          flex: 0 0 24px;
        }
        .ed-issue::after {
          content: '';
          height: 1px; background: #d0cdc5;
          flex: 1;
        }
        .ed-headline {
          font-family: 'Fraunces', serif;
          font-size: 80px;
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -3.5px;
          color: #1a1a1a;
        }
        .ed-headline em {
          font-style: italic;
          font-weight: 500;
          color: #c87137;
        }
        .ed-headline .highlight {
          display: inline-block;
          position: relative;
        }
        .ed-headline .highlight::after {
          content: '';
          position: absolute;
          left: -4px; right: -4px;
          bottom: 8px;
          height: 14px;
          background: #fef3c7;
          z-index: -1;
          transform: skew(-2deg);
        }
        .ed-actions {
          display: flex; flex-direction: column;
          gap: 10px; align-items: flex-end;
        }
        .ed-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          padding: 13px 24px;
          border-radius: 30px;
          cursor: pointer;
          white-space: nowrap;
          border: none;
          font-family: 'Inter', sans-serif;
          transition: opacity 0.15s;
        }
        .ed-btn:hover { opacity: 0.85; }
        .ed-btn-secondary {
          background: transparent;
          color: #888;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.5px;
          padding: 4px 0;
          cursor: pointer;
          border: none;
          transition: color 0.15s;
        }
        .ed-btn-secondary:hover { color: #1a1a1a; }

        /* Problem / Solution split */
        .ed-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .ed-split-card {
          border-radius: 18px;
          padding: 26px;
        }
        .ed-split-card.problem {
          background: #fff;
          border: 1px solid #e8e4de;
        }
        .ed-split-card.solution {
          background: #1a1a1a;
        }
        .ed-split-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .problem .ed-split-label { color: #c87137; }
        .solution .ed-split-label { color: #86efac; }
        .ed-split-label::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .ed-split-title {
          font-family: 'Fraunces', serif;
          font-size: 24px;
          font-weight: 500;
          letter-spacing: -0.6px;
          line-height: 1.15;
          margin-bottom: 12px;
          color: #1a1a1a;
        }
        .solution .ed-split-title { color: #fff; }
        .ed-split-body {
          font-size: 14px;
          line-height: 1.6;
          color: #666;
        }
        .solution .ed-split-body { color: #888; }
        .ed-split-tag {
          margin-top: 18px;
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }
        .problem .ed-split-tag { background: #fef2f2; color: #c11; }
        .solution .ed-split-tag { background: rgba(134,239,172,0.12); color: #86efac; }

        /* Numbers */
        .ed-numbers {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 48px;
        }
        .ed-num { padding: 24px 22px; border-right: 1px solid #e8e4de; }
        .ed-num:last-child { border-right: none; }
        .ed-num-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
        }
        .ed-num-val {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 500;
          letter-spacing: -1px;
          line-height: 1;
          color: #1a1a1a;
        }
        .ed-num-val em {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-style: normal;
          color: #999;
          margin-left: 3px;
        }

        /* How it works */
        .ed-how-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 14px;
        }
        .ed-how-title {
          font-family: 'Fraunces', serif;
          font-size: 48px;
          font-weight: 500;
          letter-spacing: -1.5px;
          line-height: 1;
          color: #1a1a1a;
          margin-bottom: 40px;
        }
        .ed-how-title em { font-style: italic; color: #c87137; }
        .ed-steps {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        .ed-step {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 18px;
          padding: 24px;
        }
        .ed-step-num {
          font-family: 'Fraunces', serif;
          font-size: 48px;
          font-weight: 400;
          color: #c87137;
          font-style: italic;
          letter-spacing: -2px;
          line-height: 1;
          margin-bottom: 14px;
        }
        .ed-step-title {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.3px;
          margin-bottom: 8px;
        }
        .ed-step-body {
          font-size: 13px;
          line-height: 1.6;
          color: #666;
        }
        .ed-step-chip {
          margin-top: 14px;
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #999;
          background: #f4f2ee;
          padding: 3px 9px;
          border-radius: 20px;
        }

        /* Footer */
        .ed-footer {
          margin: 0 32px;
          padding: 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #d0cdc5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #999;
          letter-spacing: 0.5px;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .ed-headline { font-size: 52px; letter-spacing: -2px; }
          .ed-grid { grid-template-columns: 1fr; }
          .ed-actions { align-items: flex-start; }
          .ed-split { grid-template-columns: 1fr; }
          .ed-numbers { grid-template-columns: 1fr 1fr; }
          .ed-num:nth-child(2) { border-right: none; }
          .ed-num:nth-child(1), .ed-num:nth-child(2) { border-bottom: 1px solid #e8e4de; }
          .ed-steps { grid-template-columns: 1fr; }
          .ed-hero { height: 320px; }
          .ed-float { right: 20px; }
          .ed-hero-campus { font-size: 26px; }
          .ed-main { padding: 72px 20px 32px; }
          .ed-bar, .ed-footer { padding-left: 20px; padding-right: 20px; }
          .ed-hero-wrap { padding: 12px 16px 0; }
        }
      `}</style>

      {/* Nav */}
      <div className="ed-bar">
        <div className="ed-wordmark" onClick={() => router.push("/")}>
          RoomGuard
        </div>
        <div className="ed-meta">
          <span>
            <span className="dot">●</span> live
          </span>
          <span>StarkHacks · 2026</span>
        </div>
      </div>

      <div className="ed-wrap">
        {/* Hero */}
        <div className="ed-hero-wrap">
          <div className="ed-hero">
            <img
              className="ed-hero-img"
              src="/purdue.jpg"
              alt="Purdue University campus"
            />
            <div className="ed-hero-gradient" />
            <div className="ed-hero-tag">sensor online · Room 204</div>
            <div className="ed-hero-caption">
              <div>
                <div className="ed-hero-location">West Lafayette · Indiana</div>
                <div className="ed-hero-campus">Purdue University</div>
              </div>
              <div className="ed-hero-time">
                live now
                <br />
                {time} local
              </div>
            </div>
          </div>

          {/* Floating live sensor card */}
          <div className="ed-float">
            <div className="ed-float-icon" style={{ background: sensorBg }}>
              📡
            </div>
            <div>
              <div className="ed-float-label">Cahill Hall · Room 204</div>
              <div className="ed-float-value" style={{ color: sensorColor }}>
                {sensorStatus}
              </div>
              <div className="ed-float-detail">last reading 2s ago</div>
            </div>
          </div>
        </div>

        {/* Headline + CTA */}
        <div className="ed-main">
          <div className="ed-grid">
            <div>
              <div className="ed-issue">Vol. 01 · Study rooms, reinvented</div>
              <h1 className="ed-headline">
                No more <em>ghost</em>
                <br />
                <span className="highlight">reservations.</span>
              </h1>
            </div>
            <div className="ed-actions">
              <button className="ed-btn" onClick={() => router.push("/campus")}>
                View Purdue rooms →
              </button>
              <button
                className="ed-btn-secondary"
                onClick={() => router.push("/room")}
              >
                live sensor feed ↘
              </button>
            </div>
          </div>

          {/* Problem / Solution */}
          <div className="ed-split">
            <div className="ed-split-card problem">
              <div className="ed-split-label">The problem</div>
              <div className="ed-split-title">
                Booked, abandoned, locked up for hours.
              </div>
              <div className="ed-split-body">
                Students reserve rooms, leave after twenty minutes, and the
                reservation stays live for two more hours — blocking everyone
                else from using the space.
              </div>
              <div className="ed-split-tag">
                avg. 47 min wasted / room / day
              </div>
            </div>
            <div className="ed-split-card solution">
              <div className="ed-split-label">The fix</div>
              <div className="ed-split-title">
                A sensor that knows when you've left.
              </div>
              <div className="ed-split-body">
                An eight-dollar ESP32 device with dual sensors checks the room
                every 2 seconds. If nobody's detected for 15 minutes, the
                reservation auto-releases.
              </div>
              <div className="ed-split-tag">ESP32-S3 · HC-SR04 · MPU-6050</div>
            </div>
          </div>

          {/* Numbers */}
          <div className="ed-numbers">
            <div className="ed-num">
              <div className="ed-num-label">Hardware</div>
              <div className="ed-num-val">
                $8<em>/unit</em>
              </div>
            </div>
            <div className="ed-num">
              <div className="ed-num-label">Latency</div>
              <div className="ed-num-val">
                2<em>sec</em>
              </div>
            </div>
            <div className="ed-num">
              <div className="ed-num-label">Threshold</div>
              <div className="ed-num-val">
                15<em>min</em>
              </div>
            </div>
            <div className="ed-num">
              <div className="ed-num-label">vs. enterprise</div>
              <div className="ed-num-val">
                $50k<em>+</em>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="ed-how-label">How it works</div>
          <h2 className="ed-how-title">
            Hardware meets <em>software.</em>
          </h2>
          <div className="ed-steps">
            <div className="ed-step">
              <div className="ed-step-num">01</div>
              <div className="ed-step-title">Sensor detects presence</div>
              <div className="ed-step-body">
                An ESP32-S3 with ultrasonic and vibration sensors checks the
                room every two seconds.
              </div>
              <div className="ed-step-chip">HC-SR04 + MPU-6050</div>
            </div>
            <div className="ed-step">
              <div className="ed-step-num">02</div>
              <div className="ed-step-title">Data hits the cloud</div>
              <div className="ed-step-body">
                Readings post to a Next.js API on Vercel and land in a
                PostgreSQL database in real time.
              </div>
              <div className="ed-step-chip">Next.js · Neon</div>
            </div>
            <div className="ed-step">
              <div className="ed-step-num">03</div>
              <div className="ed-step-title">Room auto-releases</div>
              <div className="ed-step-body">
                If the room stays empty for fifteen minutes, the reservation
                gets flagged for cancellation.
              </div>
              <div className="ed-step-chip">15 min threshold</div>
            </div>
          </div>
        </div>

        <footer className="ed-footer">
          <div>RoomGuard · StarkHacks 2026</div>
          <div>ESP32 · Next.js · Neon · Vercel</div>
        </footer>
      </div>
    </>
  );
}
