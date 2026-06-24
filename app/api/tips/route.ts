import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { dj, instagram, mensaje, monto } = body;

    const result = await sql`
      INSERT INTO tips (
        dj,
        instagram,
        comentario,
        monto
      )
      VALUES (
        ${dj},
        ${instagram},
        ${mensaje},
        ${monto}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      tip: result[0],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error guardando tip",
      },
      { status: 500 }
    );
  }
}