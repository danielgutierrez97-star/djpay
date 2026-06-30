import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/requireAdmin";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de liquidación requerido",
        },
        {
          status: 400,
        }
      );
    }

    const liquidaciones = await sql`
      SELECT *
      FROM liquidaciones
      WHERE id = ${id}
    `;

    if (liquidaciones.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Liquidación no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    const liquidacion = liquidaciones[0];
    const tipIds = liquidacion.tip_ids || [];

    if (tipIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Esta liquidación no tiene tip_ids asociados",
        },
        {
          status: 400,
        }
      );
    }

    await sql`
      UPDATE tips
      SET liquidado = false
      WHERE id = ANY(${tipIds})
    `;

    await sql`
      DELETE FROM liquidaciones
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error deshaciendo liquidación",
      },
      {
        status: 500,
      }
    );
  }
}