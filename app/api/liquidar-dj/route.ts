import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/requireAdmin";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { dj } = await req.json();

    if (!dj) {
      return NextResponse.json(
        {
          success: false,
          error: "DJ requerido",
        },
        {
          status: 400,
        }
      );
    }

    const tipsPendientes = await sql`
      SELECT *
      FROM tips
      WHERE dj = ${dj}
      AND liquidado = false
      ORDER BY created_at ASC
    `;

    if (tipsPendientes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No hay pagos pendientes",
        },
        {
          status: 400,
        }
      );
    }

    const montoNetoDj = tipsPendientes.reduce(
      (sum: number, tip: any) =>
        sum + Number(tip.neto_dj || 0),
      0
    );

    const tipIds = tipsPendientes.map(
      (tip: any) => tip.id
    );

    await sql`
      INSERT INTO liquidaciones (
        dj,
        monto,
        cantidad_propinas,
        tip_ids
      )
      VALUES (
        ${dj},
        ${montoNetoDj},
        ${tipsPendientes.length},
        ${JSON.stringify(tipIds)}
      )
    `;

    await sql`
      UPDATE tips
      SET liquidado = true
      WHERE id = ANY(${tipIds})
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error liquidando DJ",
      },
      {
        status: 500,
      }
    );
  }
}