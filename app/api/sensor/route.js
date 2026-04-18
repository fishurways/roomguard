import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const OCCUPIED_THRESHOLD = 50;
const RELEASE_THRESHOLD = 30 * 1000;

let roomState = {
  distance: null,
  vibrating: false,
  occupied: false,
  lastOccupiedAt: null,
  lastReadingAt: null,
  shouldRelease: false,
};

export async function POST(request) {
  const body = await request.json();
  const distance = body.distance;
  const vibrating = body.vibrating;
  const now = Date.now();

  roomState.distance = distance;
  roomState.vibrating = vibrating;
  roomState.lastReadingAt = now;

  if (distance < 50 || vibrating) {
    if (!roomState.occupied) {
      roomState.lastOccupiedAt = now;
    }
    roomState.occupied = true;
    roomState.shouldRelease = false;
  } else {
    roomState.occupied = false;
    if (roomState.lastOccupiedAt) {
      const emptyFor = now - roomState.lastOccupiedAt;
      if (emptyFor > RELEASE_THRESHOLD) {
        roomState.shouldRelease = true;
      }
    }
  }

  try {
    await sql`
      INSERT INTO room_events (distance, occupied)
      VALUES (${distance}, ${roomState.occupied})
    `;
  } catch (err) {
    console.error("DB error:", err.message);
  }

  console.log(
    `Distance: ${distance}cm | Occupied: ${roomState.occupied} | ShouldRelease: ${roomState.shouldRelease}`,
  );

  return NextResponse.json({
    success: true,
    state: roomState,
  });
}

export async function GET() {
  try {
    const events = await sql`
      SELECT * FROM room_events 
      ORDER BY created_at DESC 
      LIMIT 20
    `;
    return NextResponse.json({
      ...roomState,
      history: events,
    });
  } catch (err) {
    return NextResponse.json(roomState);
  }
}
