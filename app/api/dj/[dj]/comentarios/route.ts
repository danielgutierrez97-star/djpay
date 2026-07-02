import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dj: string }> }
) {
  try {
    const { dj } = await params;

    const fanDestacado = await sql`
      SELECT
        instagram,
        comentario
      FROM tips
      WHERE dj = ${dj}
      AND monto = 10000
      AND comentario IS NOT NULL
      AND comentario <> ''
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const comentarios = await sql`
      SELECT
        instagram,
        comentario
      FROM tips
      WHERE dj = ${dj}
      AND comentario IS NOT NULL
      AND comentario <> ''
      ORDER BY created_at DESC
      LIMIT 6
    `;

    return NextResponse.json({
      success: true,
      fanDestacado:
        fanDestacado[0] || null,
      comentarios,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error obteniendo comentarios",
      },
      { status: 500 }
    );
  }
}