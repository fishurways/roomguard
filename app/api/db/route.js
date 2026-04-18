import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS room_events (
        id SERIAL PRIMARY KEY,
        distance FLOAT NOT NULL,
        occupied BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    return NextResponse.json({ success: true, message: "Table created!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
