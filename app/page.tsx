"use client";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  distance: number;
  occupied: boolean;
  created_at: string;
}

interface RoomState {
  distance: number | null;
  vibrating: boolean;
  occupied: boolean;
  lastOccupiedAt: number | null;
  lastReadingAt: number | null;
  shouldRelease: boolean;
  history: Event[];
}

export default function Home() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      const res = await fetch("/api/sensor");
      const data = await res.json();
      setRoomState(data);
    };
    fetchState();
    const interval = setInterval(fetchState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!roomState)
    return (
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <p>Connecting to sensor...</p>
      </main>
    );

  const occupied = roomState.occupied;
  const distance = roomState.distance;
  const emptyFor = roomState.lastOccupiedAt
    ? Math.floor((Date.now() - roomState.lastOccupiedAt) / 1000)
    : null;

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        background: occupied ? "#f0fdf4" : "#fef2f2",
        padding: "40px 20px",
        transition: "background 0.5s",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "600",
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          RoomGuard
        </h1>

        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: occupied ? "#22c55e" : "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.5s",
          }}
        >
          <span style={{ fontSize: "56px" }}>{occupied ? "🟢" : "🔴"}</span>
        </div>

        <h2
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: occupied ? "#16a34a" : "#dc2626",
            margin: 0,
          }}
        >
          {occupied ? "OCCUPIED" : "VACANT"}
        </h2>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            boxSizing: "border-box",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#666" }}>Distance</span>
            <span style={{ fontWeight: "600" }}>
              {distance ? `${distance.toFixed(1)} cm` : "--"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#666" }}>Status</span>
            <span
              style={{
                fontWeight: "600",
                color: occupied ? "#16a34a" : "#dc2626",
              }}
            >
              {occupied ? "Someone is here" : "Room is empty"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#666" }}>Vibration</span>
            <span
              style={{
                fontWeight: "600",
                color: roomState.vibrating ? "#16a34a" : "#666",
              }}
            >
              {roomState.vibrating ? "Activity detected" : "No activity"}
            </span>
          </div>
          {!occupied && emptyFor !== null && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Empty for</span>
              <span style={{ fontWeight: "600", color: "#dc2626" }}>
                {emptyFor < 60
                  ? `${emptyFor}s`
                  : `${Math.floor(emptyFor / 60)}m ${emptyFor % 60}s`}
              </span>
            </div>
          )}
        </div>
        {roomState.shouldRelease && (
          <div
            style={{
              background: "#fef2f2",
              border: "2px solid #ef4444",
              borderRadius: "16px",
              padding: "20px 32px",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#dc2626",
                margin: "0 0 8px",
              }}
            >
              ⚠️ Room Auto-Released!
            </p>
            <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
              This room has been empty for over 15 minutes. The reservation has
              been automatically cancelled and the next student on the waitlist
              has been notified.
            </p>
          </div>
        )}
        {/* History Table */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "20px",
            width: "100%",
            boxSizing: "border-box",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "600" }}
          >
            Recent Events
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 4px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Time
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 4px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Distance
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 4px",
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {roomState.history?.map((event) => (
                <tr
                  key={event.id}
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                >
                  <td style={{ padding: "8px 4px", color: "#888" }}>
                    {new Date(event.created_at).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    {event.distance.toFixed(1)} cm
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontSize: "11px",
                        fontWeight: "500",
                        background: event.occupied ? "#dcfce7" : "#fee2e2",
                        color: event.occupied ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {event.occupied ? "Occupied" : "Vacant"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>
          Updates every 2 seconds · Powered by ESP32 + PostgreSQL
        </p>
      </div>
    </main>
  );
}
