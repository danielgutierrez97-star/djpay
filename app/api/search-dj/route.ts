import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const djs = await sql`
      SELECT *
      FROM djs
      WHERE
        instagram ILIKE ${"%" + query + "%"}
        OR nombre ILIKE ${"%" + query + "%"}
      LIMIT 10
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