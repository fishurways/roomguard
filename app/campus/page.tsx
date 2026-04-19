"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SensorResponse {
  occupied: boolean;
  distance: number | null;
  vibrating: boolean;
  shouldRelease: boolean;
}

const ROOMS = [
  {
    id: "204",
    name: "Room 204",
    building: "Cahill Study Hall",
    floor: "2nd floor",
    capacity: 6,
    live: true,
  },
  {
    id: "101",
    name: "Room 101",
    building: "Cahill Study Hall",
    floor: "1st floor",
    capacity: 4,
    live: false,
  },
  {
    id: "310",
    name: "Room 310",
    building: "WALC",
    floor: "3rd floor",
    capacity: 8,
    live: false,
  },
  {
    id: "205",
    name: "Room 205",
    building: "Cahill Study Hall",
    floor: "2nd floor",
    capacity: 4,
    live: false,
  },
  {
    id: "412",
    name: "Room 412",
    building: "HSSE Library",
    floor: "4th floor",
    capacity: 10,
    live: false,
  },
  {
    id: "202",
    name: "Room 202",
    building: "WALC",
    floor: "2nd floor",
    capacity: 6,
    live: false,
  },
];

const STATIC_STATES: Record<string, { occupied: boolean }> = {
  "101": { occupied: false },
  "310": { occupied: true },
  "205": { occupied: false },
  "412": { occupied: true },
  "202": { occupied: false },
};

// ── Animation variants ──────────────────────────────────────────────────
const fadeDown = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const pillStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const pillChild = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CampusPage() {
  const router = useRouter();
  const [liveData, setLiveData] = useState<SensorResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor");
        if (res.ok) setLiveData(await res.json());
      } catch {}
    };
    fetchData();
    const id = setInterval(fetchData, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f0ece4;
          min-height: 100vh;
          /* Brighter — medium-dark, not pitch black */
          background:
            radial-gradient(ellipse 80% 60% at 15% 10%, rgba(200,113,55,0.22) 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 85% 85%, rgba(74,222,128,0.12) 0%, transparent 55%),
            linear-gradient(150deg, #2a1f14 0%, #1a2318 45%, #141420 100%);
          background-attachment: fixed;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle 700px at 10% 20%, rgba(200,113,55,0.1) 0%, transparent 65%),
            radial-gradient(circle 500px at 90% 80%, rgba(74,222,128,0.07) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .cp-nav, .cp-page { position: relative; z-index: 1; }

        /* ── Nav ─────────────────────────────────── */
        .cp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(30,22,14,0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .cp-wordmark {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.3px;
          cursor: pointer;
          color: #f0ece4;
        }

        .cp-wordmark-icon {
          width: 28px; height: 28px;
          background: rgba(240,236,228,0.9);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }

        .cp-wordmark-icon svg circle { }

        .cp-breadcrumb {
          font-size: 13px;
          color: rgba(240,236,228,0.35);
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cp-breadcrumb .active { color: #f0ece4; font-weight: 500; }

        .cp-live-badge {
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
          backdrop-filter: blur(8px);
        }

        .cp-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* ── Page ────────────────────────────────── */
        .cp-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 36px 24px 64px;
        }

        .cp-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(240,236,228,0.35);
          font-family: 'DM Mono', monospace;
          margin-bottom: 8px;
        }

        .cp-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #f0ece4;
          margin-bottom: 6px;
        }

        .cp-sub {
          font-size: 14px;
          color: rgba(240,236,228,0.45);
        }

        /* Summary pills */
        .cp-summary {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .cp-summary-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(240,236,228,0.6);
          backdrop-filter: blur(8px);
        }

        .cp-pill-dot { width: 7px; height: 7px; border-radius: 50%; }
        .cp-pill-dot.green { background: #4ade80; }
        .cp-pill-dot.red   { background: #f87171; }
        .cp-pill-dot.gray  { background: rgba(240,236,228,0.2); }

        /* Room grid */
        .cp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cp-room-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 22px;
          cursor: pointer;
          position: relative;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.2);
          transition: border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .cp-room-card:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.07);
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.3);
        }

        .cp-room-card.live-card {
          border-color: rgba(200,113,55,0.4);
          background: rgba(200,113,55,0.06);
          box-shadow: inset 0 1px 0 rgba(200,113,55,0.1), 0 4px 24px rgba(0,0,0,0.2);
        }
        .cp-room-card.live-card:hover {
          border-color: rgba(200,113,55,0.6);
          background: rgba(200,113,55,0.09);
        }

        .cp-room-card.static-card { cursor: default; }
        .cp-room-card.static-card:hover {
          border-color: rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          transform: none;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.2);
        }

        .cp-room-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .cp-room-name {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: #f0ece4;
        }

        .cp-room-building {
          font-size: 12px;
          color: rgba(240,236,228,0.35);
          margin-top: 2px;
          font-family: 'DM Mono', monospace;
        }

        .cp-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .cp-status-badge.occupied {
          background: rgba(240,236,228,0.1);
          border: 1px solid rgba(240,236,228,0.15);
          color: #f0ece4;
        }
        .cp-status-badge.vacant {
          background: rgba(74,222,128,0.12);
          border: 1px solid rgba(74,222,128,0.25);
          color: #4ade80;
        }
        .cp-status-badge.unknown {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(240,236,228,0.4);
        }

        .cp-status-dot { width: 5px; height: 5px; border-radius: 50%; }
        .occupied .cp-status-dot { background: rgba(240,236,228,0.6); }
        .vacant   .cp-status-dot { background: #4ade80; animation: pulse 2s ease-in-out infinite; }
        .unknown  .cp-status-dot { background: rgba(240,236,228,0.2); }

        .cp-room-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
        }

        .cp-room-cap {
          font-size: 12px;
          color: rgba(240,236,228,0.3);
          font-family: 'DM Mono', monospace;
        }

        .cp-live-tag {
          font-size: 10px;
          font-weight: 600;
          color: rgba(240,236,228,0.25);
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .cp-live-tag.real { color: #4ade80; }

        .cp-view-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 14px;
          font-size: 12px;
          font-weight: 600;
          color: #f0ece4;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s, border-color 0.15s;
        }
        .cp-view-link:hover {
          background: rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.2);
        }

        .cp-sensor-badge {
          position: absolute;
          top: -1px;
          right: 16px;
          background: rgba(200,113,55,0.85);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 0 0 8px 8px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.5px;
        }

        @media (max-width: 600px) {
          .cp-grid { grid-template-columns: 1fr; }
          .cp-nav { padding: 12px 20px; }
          .cp-breadcrumb { display: none; }
        }
      `}</style>

      {/* Nav */}
      <motion.nav
        className="cp-nav"
        initial="hidden"
        animate="visible"
        variants={fadeDown}
      >
        <div className="cp-wordmark" onClick={() => router.push("/")}>
          <div className="cp-wordmark-icon">
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
        <div className="cp-breadcrumb">
          <span onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            Home
          </span>
          →<span className="active">Purdue</span>
        </div>
        <div className="cp-live-badge">
          <div className="cp-live-dot" />
          live
        </div>
      </motion.nav>

      <div className="cp-page">
        {/* Header */}
        <motion.div
          style={{ marginBottom: 32 }}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="cp-eyebrow">
            Purdue University · West Lafayette, IN
          </div>
          <div className="cp-title">Study Rooms</div>
          <div className="cp-sub">
            Real-time occupancy powered by RoomGuard sensors
          </div>
        </motion.div>

        {/* Summary pills — stagger in */}
        <motion.div
          className="cp-summary"
          initial="hidden"
          animate="visible"
          variants={pillStagger}
        >
          <motion.div className="cp-summary-pill" variants={pillChild}>
            <div className="cp-pill-dot green" />
            {
              ROOMS.filter((r) =>
                r.live
                  ? liveData
                    ? !liveData.occupied
                    : false
                  : !STATIC_STATES[r.id]?.occupied,
              ).length
            }{" "}
            vacant
          </motion.div>
          <motion.div className="cp-summary-pill" variants={pillChild}>
            <div className="cp-pill-dot red" />
            {
              ROOMS.filter((r) =>
                r.live
                  ? liveData
                    ? liveData.occupied
                    : false
                  : STATIC_STATES[r.id]?.occupied,
              ).length
            }{" "}
            occupied
          </motion.div>
          <motion.div className="cp-summary-pill" variants={pillChild}>
            <div className="cp-pill-dot gray" />
            {ROOMS.length} rooms total
          </motion.div>
        </motion.div>

        {/* Room grid — staggered cards */}
        <motion.div
          className="cp-grid"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {ROOMS.map((room) => {
            const isLive = room.live;
            const occupied = isLive
              ? (liveData?.occupied ?? false)
              : (STATIC_STATES[room.id]?.occupied ?? false);

            const statusClass = isLive
              ? liveData === null
                ? "unknown"
                : occupied
                  ? "occupied"
                  : "vacant"
              : occupied
                ? "occupied"
                : "vacant";

            const statusLabel = isLive
              ? liveData === null
                ? "Connecting…"
                : occupied
                  ? "Occupied"
                  : "Vacant"
              : occupied
                ? "Occupied"
                : "Vacant";

            return (
              <motion.div
                key={room.id}
                className={`cp-room-card ${isLive ? "live-card" : "static-card"}`}
                variants={staggerChild}
                onClick={() => isLive && router.push("/room")}
              >
                {isLive && <div className="cp-sensor-badge">● SENSOR LIVE</div>}

                <div className="cp-room-top">
                  <div>
                    <div className="cp-room-name">{room.name}</div>
                    <div className="cp-room-building">{room.building}</div>
                  </div>
                  <div className={`cp-status-badge ${statusClass}`}>
                    <div className="cp-status-dot" />
                    {statusLabel}
                  </div>
                </div>

                <div className="cp-room-meta">
                  <div className="cp-room-cap">
                    Up to {room.capacity} people · {room.floor}
                  </div>
                  <div className={`cp-live-tag ${isLive ? "real" : ""}`}>
                    {isLive ? "● hardware" : "○ simulated"}
                  </div>
                </div>

                {isLive && (
                  <button
                    className="cp-view-link"
                    onClick={() => router.push("/room")}
                  >
                    View live feed →
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
}
