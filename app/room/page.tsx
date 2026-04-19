"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ───────────────────────────────────────────────────────────────────
interface HistoryEvent {
  distance: number;
  occupied: boolean;
  created_at: string;
}

interface SensorResponse {
  occupied: boolean;
  distance: number | null;
  vibrating: boolean;
  lastOccupiedAt: number | null;
  lastReadingAt: number | null;
  shouldRelease: boolean;
  history: HistoryEvent[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour12: false });
}

function fmtEmpty(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ── Animations ──────────────────────────────────────────────────────────────
const fadeDown = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function RoomGuardDashboard() {
  const router = useRouter();
  const [data, setData] = useState<SensorResponse | null>(null);
  const [clock, setClock] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
      setNow(Date.now());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor");
        if (res.ok) setData(await res.json());
      } catch {}
    };
    fetchData();
    const id = setInterval(fetchData, 2000);
    return () => clearInterval(id);
  }, []);

  const occupied = data?.occupied ?? false;
  const distance = data?.distance ?? 0;
  const vibrating = data?.vibrating ?? false;
  const shouldRelease = data?.shouldRelease ?? false;
  const history = data?.history ?? [];

  const emptyMs =
    !occupied && data?.lastOccupiedAt ? now - data.lastOccupiedAt : 0;
  const distPct = Math.min(100, Math.round((1 - distance / 200) * 100));
  const vacantCount = history.filter((e) => !e.occupied).length;
  const avgDist =
    history.length > 0
      ? Math.round(history.reduce((a, e) => a + e.distance, 0) / history.length)
      : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f0ece4;
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 60% at 15% 10%, rgba(200,113,55,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 85%, rgba(74,222,128,0.12) 0%, transparent 55%),
            linear-gradient(150deg, #2a1f14 0%, #1a2318 45%, #141420 100%);
          background-attachment: fixed;
        }

        body::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(circle 600px at 10% 20%, rgba(200,113,55,0.1) 0%, transparent 65%),
            radial-gradient(circle 500px at 90% 80%, rgba(74,222,128,0.07) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .rg-page {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          padding: 20px 20px 48px;
        }

        /* ── Nav ─────────────────────────────── */
        .rg-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding: 10px 16px;
          background: rgba(30,22,14,0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
        }

        .rg-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rg-wordmark {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: #f0ece4;
          cursor: pointer;
        }
        .rg-wordmark-icon {
          width: 26px; height: 26px;
          background: rgba(240,236,228,0.9);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }

        .rg-breadcrumb {
          font-size: 12px;
          color: rgba(240,236,228,0.3);
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rg-breadcrumb .active { color: rgba(240,236,228,0.7); }

        .rg-live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          color: rgba(240,236,228,0.7);
          font-family: 'DM Mono', monospace;
        }
        .rg-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ── Banner ──────────────────────────── */
        .rg-banner {
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 12px;
          padding: 10px 16px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #fbbf24;
          backdrop-filter: blur(8px);
        }
        .rg-banner-icon {
          font-size: 14px;
          flex-shrink: 0;
        }

        /* ── Hero grid ───────────────────────── */
        .rg-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 10px;
          margin-bottom: 10px;
        }

        /* Status card */
        .rg-status-card {
          border-radius: 14px;
          padding: 18px;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid;
          transition: background 0.4s ease, border-color 0.4s ease;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .rg-status-card.occupied {
          background: rgba(240,236,228,0.07);
          border-color: rgba(240,236,228,0.12);
        }
        .rg-status-card.vacant {
          background: rgba(74,222,128,0.08);
          border-color: rgba(74,222,128,0.2);
        }

        .rg-room-tag {
          display: inline-flex;
          align-items: center;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 20px;
          width: fit-content;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.3px;
        }
        .occupied .rg-room-tag { background: rgba(255,255,255,0.08); color: rgba(240,236,228,0.5); }
        .vacant   .rg-room-tag { background: rgba(74,222,128,0.12); color: #4ade80; }

        .rg-status-big {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -1.5px;
          line-height: 1;
          margin-top: 12px;
        }
        .occupied .rg-status-big { color: #f0ece4; }
        .vacant   .rg-status-big { color: #4ade80; }

        .rg-status-sub {
          font-size: 11px;
          margin-top: 5px;
          font-family: 'DM Mono', monospace;
        }
        .occupied .rg-status-sub { color: rgba(240,236,228,0.35); }
        .vacant   .rg-status-sub { color: rgba(74,222,128,0.6); }

        /* Sensor card */
        .rg-sensor-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 18px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .rg-sensor-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(240,236,228,0.35);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-family: 'DM Mono', monospace;
        }
        .rg-dist-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .rg-dist-num {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1;
          color: #f0ece4;
        }
        .rg-dist-unit {
          font-size: 13px;
          color: rgba(240,236,228,0.3);
          margin-left: 2px;
          font-family: 'DM Mono', monospace;
          padding-bottom: 5px;
        }
        .rg-vib-pill {
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          font-family: 'DM Mono', monospace;
          transition: all 0.3s;
          border: 1px solid;
        }
        .rg-vib-pill.on  {
          background: rgba(74,222,128,0.1);
          border-color: rgba(74,222,128,0.25);
          color: #4ade80;
        }
        .rg-vib-pill.off {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
          color: rgba(240,236,228,0.3);
        }

        .rg-track {
          margin-top: 14px;
          height: 4px;
          background: rgba(255,255,255,0.07);
          border-radius: 10px;
          overflow: hidden;
        }
        .rg-track-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.5s ease, background 0.3s;
        }
        .rg-track-labels {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: rgba(240,236,228,0.2);
          margin-top: 5px;
          font-family: 'DM Mono', monospace;
        }

        /* ── Stats ───────────────────────────── */
        .rg-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        .rg-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 14px 16px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .rg-stat-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(240,236,228,0.3);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          font-family: 'DM Mono', monospace;
        }
        .rg-stat-num {
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #f0ece4;
        }
        .rg-stat-num.amber { color: #fbbf24; }
        .rg-stat-num.green { color: #4ade80; }
        .rg-stat-unit {
          font-size: 13px;
          color: rgba(240,236,228,0.3);
          font-family: 'DM Mono', monospace;
        }

        /* ── Events ──────────────────────────── */
        .rg-events {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .rg-events-header {
          padding: 14px 18px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .rg-events-title {
          font-size: 13px;
          font-weight: 600;
          color: #f0ece4;
        }
        .rg-events-badge {
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          color: rgba(240,236,228,0.3);
        }

        table.rg-table { width: 100%; border-collapse: collapse; }
        .rg-table th {
          text-align: left;
          padding: 9px 18px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(240,236,228,0.3);
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
        }
        .rg-table td {
          padding: 9px 18px;
          border-top: 1px solid rgba(255,255,255,0.05);
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: rgba(240,236,228,0.5);
        }
        .rg-chip {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: 1px solid;
        }
        .rg-chip.occ {
          background: rgba(240,236,228,0.08);
          border-color: rgba(240,236,228,0.14);
          color: #f0ece4;
        }
        .rg-chip.vac {
          background: rgba(74,222,128,0.1);
          border-color: rgba(74,222,128,0.22);
          color: #4ade80;
        }

        /* ── Loading ─────────────────────────── */
        .rg-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 360px;
          font-size: 12px;
          color: rgba(240,236,228,0.3);
          gap: 8px;
          font-family: 'DM Mono', monospace;
        }
        .rg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: rgba(240,236,228,0.6);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rg-page">
        {/* Nav */}
        <motion.nav
          className="rg-nav"
          initial="hidden"
          animate="visible"
          variants={fadeDown}
        >
          <div className="rg-nav-left">
            <div className="rg-wordmark" onClick={() => router.push("/")}>
              <div className="rg-wordmark-icon">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="4" fill="#1a1a1a" />
                  <circle
                    cx="8"
                    cy="8"
                    r="6.5"
                    stroke="#1a1a1a"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              RoomGuard
            </div>
            <div className="rg-breadcrumb">
              <span
                onClick={() => router.push("/campus")}
                style={{ cursor: "pointer" }}
              >
                Purdue
              </span>
              →<span className="active">Room 204</span>
            </div>
          </div>
          <div className="rg-live-badge">
            <div className="rg-live-dot" />
            {clock}
          </div>
        </motion.nav>

        {/* Auto-release banner */}
        <AnimatePresence>
          {shouldRelease && (
            <motion.div
              className="rg-banner"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rg-banner-icon">⚠️</div>
              <div>
                Auto-release triggered — reservation flagged for cancellation
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {!data ? (
          <div className="rg-loading">
            <div className="rg-spinner" />
            connecting to sensor…
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            {/* Hero */}
            <motion.div className="rg-hero" variants={staggerChild}>
              <div
                className={`rg-status-card ${occupied ? "occupied" : "vacant"}`}
              >
                <div className="rg-room-tag">Room 204 · Cahill Hall</div>
                <div>
                  <div className="rg-status-big">
                    {occupied ? "Occupied" : "Vacant"}
                  </div>
                  <div className="rg-status-sub">
                    {occupied
                      ? "Room is in use"
                      : `Empty for ${fmtEmpty(emptyMs)}`}
                  </div>
                </div>
              </div>

              <div className="rg-sensor-card">
                <div className="rg-sensor-label">Ultrasonic distance</div>
                <div className="rg-dist-row">
                  <div>
                    <span className="rg-dist-num">{distance}</span>
                    <span className="rg-dist-unit">cm</span>
                  </div>
                  <div className={`rg-vib-pill ${vibrating ? "on" : "off"}`}>
                    {vibrating ? "vibration ✓" : "vibration —"}
                  </div>
                </div>
                <div className="rg-track">
                  <div
                    className="rg-track-fill"
                    style={{
                      width: `${distPct}%`,
                      background: distance < 50 ? "#f0ece4" : "#4ade80",
                    }}
                  />
                </div>
                <div className="rg-track-labels">
                  <span>0 cm</span>
                  <span>50 cm threshold</span>
                  <span>200 cm</span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div className="rg-stats" variants={staggerChild}>
              <div className="rg-stat">
                <div className="rg-stat-label">Events logged</div>
                <div className="rg-stat-num">{history.length}</div>
              </div>
              <div className="rg-stat">
                <div className="rg-stat-label">Vacant readings</div>
                <div className="rg-stat-num amber">{vacantCount}</div>
              </div>
              <div className="rg-stat">
                <div className="rg-stat-label">Avg distance</div>
                <div className="rg-stat-num green">
                  {avgDist}
                  <span className="rg-stat-unit"> cm</span>
                </div>
              </div>
            </motion.div>

            {/* Event log */}
            <motion.div className="rg-events" variants={staggerChild}>
              <div className="rg-events-header">
                <div className="rg-events-title">Event log</div>
                <div className="rg-events-badge">updating every 2s</div>
              </div>
              <table className="rg-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Distance</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((e, i) => (
                    <tr key={i}>
                      <td>{fmtTime(e.created_at)}</td>
                      <td>{e.distance} cm</td>
                      <td>
                        <span
                          className={`rg-chip ${e.occupied ? "occ" : "vac"}`}
                        >
                          {e.occupied ? "occupied" : "vacant"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
