import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) {
      return NextResponse.json([]);
    }

    const djs = await sql`
      SELECT instagram, nombre
      FROM djs
      WHERE
        instagram ILIKE ${"%" + q + "%"}
        OR nombre ILIKE ${"%" + q + "%"}
      ORDER BY nombre
      LIMIT 5
    `;

    return NextResponse.json(djs);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error buscando DJs" },
      { status: 500 }
    );
  }
}