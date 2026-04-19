"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SensorResponse {
  occupied: boolean;
  distance: number | null;
  vibrating: boolean;
  shouldRelease: boolean;
}

// Static rooms — only Room 204 is real (live sensor)
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

// Static states for non-live rooms (just for display)
const STATIC_STATES: Record<string, { occupied: boolean; label: string }> = {
  "101": { occupied: false, label: "Vacant" },
  "310": { occupied: true, label: "Occupied" },
  "205": { occupied: false, label: "Vacant" },
  "412": { occupied: true, label: "Occupied" },
  "202": { occupied: false, label: "Vacant" },
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

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f2ee;
          color: #1a1a1a;
          min-height: 100vh;
        }

        .cp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid #e8e4de;
          background: #f4f2ee;
        }

        .cp-wordmark {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.3px;
          cursor: pointer;
        }

        .cp-wordmark-icon {
          width: 28px; height: 28px;
          background: #1a1a1a;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
        }

        .cp-breadcrumb {
          font-size: 13px;
          color: #aaa;
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cp-breadcrumb span { color: #1a1a1a; font-weight: 500; }

        .cp-live-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 500;
          color: #555;
          font-family: 'DM Mono', monospace;
        }

        .cp-live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .cp-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 36px 24px 64px;
        }

        .cp-header {
          margin-bottom: 32px;
        }

        .cp-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #aaa;
          font-family: 'DM Mono', monospace;
          margin-bottom: 8px;
        }

        .cp-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #1a1a1a;
          margin-bottom: 6px;
        }

        .cp-sub {
          font-size: 14px;
          color: #888;
        }

        /* Summary bar */
        .cp-summary {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .cp-summary-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 500;
          color: #555;
        }

        .cp-pill-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
        }
        .cp-pill-dot.green { background: #22c55e; }
        .cp-pill-dot.red   { background: #ef4444; }
        .cp-pill-dot.gray  { background: #d0d0d0; }

        /* Room grid */
        .cp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .cp-room-card {
          background: #fff;
          border: 1px solid #e8e4de;
          border-radius: 16px;
          padding: 22px;
          cursor: pointer;
          transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
          position: relative;
        }

        .cp-room-card:hover {
          border-color: #1a1a1a;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }

        .cp-room-card.live-card {
          border-color: #1a1a1a;
          border-width: 1.5px;
        }

        .cp-room-card.static-card {
          cursor: default;
        }
        .cp-room-card.static-card:hover {
          border-color: #e8e4de;
          transform: none;
          box-shadow: none;
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
        }

        .cp-room-building {
          font-size: 12px;
          color: #aaa;
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

        .cp-status-badge.occupied { background: #1a1a1a; color: #fff; }
        .cp-status-badge.vacant   { background: #d4f5d4; color: #1a4d1a; }
        .cp-status-badge.unknown  { background: #f3f4f6; color: #aaa; }

        .cp-status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
        }
        .occupied .cp-status-dot { background: #fff; }
        .vacant   .cp-status-dot { background: #22c55e; animation: pulse 2s ease-in-out infinite; }
        .unknown  .cp-status-dot { background: #ccc; }

        .cp-room-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
        }

        .cp-room-cap {
          font-size: 12px;
          color: #bbb;
          font-family: 'DM Mono', monospace;
        }

        .cp-live-tag {
          font-size: 10px;
          font-weight: 600;
          color: #888;
          font-family: 'DM Mono', monospace;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .cp-live-tag.real { color: #16a34a; }

        .cp-view-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 14px;
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
          background: #f4f2ee;
          padding: 6px 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s;
        }
        .cp-view-link:hover { background: #ebe8e3; }

        .cp-sensor-badge {
          position: absolute;
          top: -1px;
          right: 16px;
          background: #1a1a1a;
          color: #fff;
          font-size: 9px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 0 0 8px 8px;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.5px;
        }
      `}</style>

      {/* Nav */}
      <nav className="cp-nav">
        <div className="cp-wordmark" onClick={() => router.push("/")}>
          <div className="cp-wordmark-icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="4" fill="white" />
              <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          RoomGuard
        </div>
        <div className="cp-breadcrumb">
          <span
            onClick={() => router.push("/")}
            style={{ cursor: "pointer", color: "#aaa" }}
          >
            Home
          </span>
          →<span>Purdue</span>
        </div>
        <div className="cp-live-badge">
          <div className="cp-live-dot" />
          live
        </div>
      </nav>

      <div className="cp-page">
        {/* Header */}
        <div className="cp-header">
          <div className="cp-eyebrow">
            Purdue University · West Lafayette, IN
          </div>
          <div className="cp-title">Study Rooms</div>
          <div className="cp-sub">
            Real-time occupancy powered by RoomGuard sensors
          </div>
        </div>

        {/* Summary pills */}
        <div className="cp-summary">
          <div className="cp-summary-pill">
            <div className="cp-pill-dot green" />
            {
              ROOMS.filter((r) => {
                if (r.live) return liveData ? !liveData.occupied : false;
                return !STATIC_STATES[r.id]?.occupied;
              }).length
            }{" "}
            vacant
          </div>
          <div className="cp-summary-pill">
            <div className="cp-pill-dot red" />
            {
              ROOMS.filter((r) => {
                if (r.live) return liveData ? liveData.occupied : false;
                return STATIC_STATES[r.id]?.occupied;
              }).length
            }{" "}
            occupied
          </div>
          <div className="cp-summary-pill">
            <div className="cp-pill-dot gray" />
            {ROOMS.length} rooms total
          </div>
        </div>

        {/* Room grid */}
        <div className="cp-grid">
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
              <div
                key={room.id}
                className={`cp-room-card ${isLive ? "live-card" : "static-card"}`}
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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
