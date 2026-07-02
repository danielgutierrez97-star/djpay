import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dj: string }> }
) {
  try {
    const { dj } = await params;

    const result = await sql`
      SELECT
        nombre,
        instagram,
        activo,
        foto_perfil
      FROM djs
      WHERE instagram = ${dj}
      AND activo = true
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "DJ no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      dj: result[0],
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error buscando DJ",
      },
      { status: 500 }
    );
  }
}