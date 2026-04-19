"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
interface HistoryEvent {
  distance: number;
  occupied: boolean;
  created_at: string;
}

interface SensorResponse {
  occupied: boolean;
  distance: number | null;
  vibrating: boolean;
  lastOccupiedAt: number | null; // epoch ms from Date.now()
  lastReadingAt: number | null;
  shouldRelease: boolean;
  history: HistoryEvent[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour12: false });
}

function fmtEmpty(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function RoomGuardDashboard() {
  const [data, setData] = useState<SensorResponse | null>(null);
  const [clock, setClock] = useState("");
  const [now, setNow] = useState(Date.now());

  // Live clock + "now" ticker so emptySeconds updates every second
  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
      setNow(Date.now());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Poll sensor API every 2 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/sensor");
        if (res.ok) setData(await res.json());
      } catch {
        // silently ignore network blips
      }
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

  // How long has the room been empty? lastOccupiedAt is epoch ms.
  const emptyMs =
    !occupied && data?.lastOccupiedAt ? now - data.lastOccupiedAt : 0;

  // Bar fill: closer to sensor = fuller bar
  const distPct = Math.min(100, Math.round((1 - distance / 200) * 100));

  // Derived stats from history
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

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f2ee;
          color: #1a1a1a;
          min-height: 100vh;
        }

        .rg-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 28px 20px 48px;
        }

        .rg-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .rg-wordmark {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .rg-wordmark-icon {
          width: 30px; height: 30px;
          background: #1a1a1a;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .rg-live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 500;
          color: #555;
          font-family: 'DM Mono', monospace;
        }
        .rg-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .rg-banner {
          background: #fff8ec;
          border: 1.5px solid #fde68a;
          border-radius: 14px;
          padding: 12px 18px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #92400e;
        }
        .rg-banner-icon {
          width: 28px; height: 28px;
          background: #fef3c7;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .rg-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 12px;
          margin-bottom: 12px;
        }

        .rg-status-card {
          border-radius: 16px;
          padding: 22px;
          min-height: 170px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: background 0.4s ease;
        }
        .rg-status-card.occupied { background: #1a1a1a; }
        .rg-status-card.vacant   { background: #d4f5d4; }

        .rg-room-tag {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          width: fit-content;
        }
        .occupied .rg-room-tag { background: rgba(255,255,255,0.1); color: #aaa; }
        .vacant   .rg-room-tag { background: rgba(0,0,0,0.07);      color: #4a7a4a; }

        .rg-status-big {
          font-size: 40px;
          font-weight: 700;
          letter-spacing: -1.5px;
          line-height: 1;
          margin-top: 16px;
        }
        .occupied .rg-status-big { color: #fff; }
        .vacant   .rg-status-big { color: #1a4d1a; }

        .rg-status-sub {
          font-size: 12px;
          margin-top: 6px;
          font-family: 'DM Mono', monospace;
        }
        .occupied .rg-status-sub { color: #666; }
        .vacant   .rg-status-sub { color: #5a8a5a; }

        .rg-sensor-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px;
        }
        .rg-sensor-label {
          font-size: 11px;
          font-weight: 600;
          color: #aaa;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .rg-dist-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .rg-dist-num {
          font-size: 46px;
          font-weight: 700;
          letter-spacing: -2px;
          line-height: 1;
        }
        .rg-dist-unit {
          font-size: 14px;
          color: #bbb;
          margin-left: 2px;
          font-family: 'DM Mono', monospace;
          padding-bottom: 6px;
        }
        .rg-vib-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 20px;
          font-family: 'DM Mono', monospace;
          transition: all 0.3s;
        }
        .rg-vib-pill.on  { background: #dcfce7; color: #16a34a; }
        .rg-vib-pill.off { background: #f3f4f6; color: #bbb; }

        .rg-track {
          margin-top: 16px;
          height: 6px;
          background: #f0ede8;
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
          font-size: 10px;
          color: #ccc;
          margin-top: 5px;
          font-family: 'DM Mono', monospace;
        }

        .rg-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .rg-stat {
          background: #fff;
          border-radius: 16px;
          padding: 18px 20px;
        }
        .rg-stat-label {
          font-size: 11px;
          font-weight: 600;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          margin-bottom: 8px;
        }
        .rg-stat-num {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #1a1a1a;
        }
        .rg-stat-num.amber { color: #d97706; }
        .rg-stat-num.green { color: #16a34a; }
        .rg-stat-unit {
          font-size: 14px;
          color: #bbb;
          font-family: 'DM Mono', monospace;
        }

        .rg-events {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
        }
        .rg-events-header {
          padding: 18px 20px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f5f2ee;
        }
        .rg-events-title { font-size: 14px; font-weight: 600; }
        .rg-events-badge {
          font-size: 11px;
          font-family: 'DM Mono', monospace;
          color: #bbb;
        }

        table.rg-table { width: 100%; border-collapse: collapse; }
        .rg-table th {
          text-align: left;
          padding: 10px 20px;
          font-size: 11px;
          font-weight: 600;
          color: #bbb;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .rg-table td {
          padding: 10px 20px;
          border-top: 1px solid #f5f2ee;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
          color: #555;
        }
        .rg-chip {
          display: inline-block;
          padding: 3px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .rg-chip.occ { background: #1a1a1a; color: #fff; }
        .rg-chip.vac { background: #d4f5d4; color: #1a4d1a; }

        .rg-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          font-size: 13px;
          color: #aaa;
          gap: 8px;
          font-family: 'DM Mono', monospace;
        }
        .rg-spinner {
          width: 16px; height: 16px;
          border: 2px solid #e5e5e5;
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rg-page">
        {/* Nav */}
        <nav className="rg-nav">
          <div className="rg-wordmark">
            <div className="rg-wordmark-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="4" fill="white" />
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            RoomGuard
          </div>
          <div className="rg-live-badge">
            <div className="rg-live-dot" />
            {clock}
          </div>
        </nav>

        {/* Auto-release banner — driven by shouldRelease from your API */}
        {shouldRelease && (
          <div className="rg-banner">
            <div className="rg-banner-icon">⚠️</div>
            <div>
              Auto-release triggered — reservation flagged for cancellation
            </div>
          </div>
        )}

        {/* Loading state */}
        {!data ? (
          <div className="rg-loading">
            <div className="rg-spinner" />
            connecting to sensor…
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="rg-hero">
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
                  {/* "vibrating" matches your API field name exactly */}
                  <div className={`rg-vib-pill ${vibrating ? "on" : "off"}`}>
                    {vibrating ? "vibration ✓" : "vibration —"}
                  </div>
                </div>
                <div className="rg-track">
                  <div
                    className="rg-track-fill"
                    style={{
                      width: `${distPct}%`,
                      background: distance < 50 ? "#1a1a1a" : "#22c55e",
                    }}
                  />
                </div>
                <div className="rg-track-labels">
                  <span>0 cm</span>
                  <span>50 cm threshold</span>
                  <span>200 cm</span>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="rg-stats">
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
            </div>

            {/* Event log — vibration not shown since it's not stored in DB */}
            <div className="rg-events">
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
            </div>
          </>
        )}
      </div>
    </>
  );
}
