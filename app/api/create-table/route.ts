import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tips (
        id SERIAL PRIMARY KEY,
        dj VARCHAR(255),
        instagram VARCHAR(255),
        comentario TEXT,
        monto INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    return NextResponse.json({
      success: true,
      message: "Tabla creada correctamente",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error,
    });
  }
}