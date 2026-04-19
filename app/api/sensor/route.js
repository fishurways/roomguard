import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const OCCUPIED_THRESHOLD = 50;
const RELEASE_THRESHOLD = 30 * 1000; // 30 seconds vacant before releasing
const VACANT_CONFIRM_TIME = 30 * 1000; // must be vacant 30s before flipping to vacant

let roomState = {
  distance: null,
  vibrating: false,
  occupied: false,
  lastOccupiedAt: null,
  lastReadingAt: null,
  firstVacantAt: null, // tracks when vacancy started
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

  // BOTH sensors must confirm occupied
  const sensorsConfirmOccupied = distance < OCCUPIED_THRESHOLD && vibrating;

  if (sensorsConfirmOccupied) {
    // Definitely occupied
    if (!roomState.occupied) {
      roomState.lastOccupiedAt = now;
    }
    roomState.occupied = true;
    roomState.firstVacantAt = null; // reset vacant timer
    roomState.shouldRelease = false;
  } else {
    // Sensors suggest vacant — but wait 30s to confirm
    if (roomState.occupied) {
      // Just became potentially vacant
      if (!roomState.firstVacantAt) {
        roomState.firstVacantAt = now; // start vacant timer
      }

      const vacantFor = now - roomState.firstVacantAt;

      if (vacantFor >= VACANT_CONFIRM_TIME) {
        // Been vacant for 30s — now officially vacant
        roomState.occupied = false;
        roomState.lastOccupiedAt = now;
      }
      // else: still occupied, waiting for 30s confirmation
    } else {
      // Already vacant — check auto-release
      if (roomState.lastOccupiedAt) {
        const emptyFor = now - roomState.lastOccupiedAt;
        if (emptyFor > RELEASE_THRESHOLD) {
          roomState.shouldRelease = true;
        }
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
    `Distance: ${distance}cm | Vibrating: ${vibrating} | Occupied: ${roomState.occupied} | ShouldRelease: ${roomState.shouldRelease}`,
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
