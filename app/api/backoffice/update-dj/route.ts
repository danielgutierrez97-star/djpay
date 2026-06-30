import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const {
      id,
      nombre,
      email,
      rut,
      banco,
      tipo_cuenta,
      numero_cuenta,
      tipo_liquidacion,
      comision,
      activo,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID no proporcionado",
        },
        { status: 400 }
      );
    }

    await sql`
      UPDATE djs
      SET
        nombre = ${nombre},
        email = ${email},
        rut = ${rut},
        banco = ${banco},
        tipo_cuenta = ${tipo_cuenta},
        numero_cuenta = ${numero_cuenta},
        tipo_liquidacion = ${tipo_liquidacion},
        comision = ${comision},
        activo = ${activo},
        updated_at = NOW()
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
        error: "Error actualizando DJ",
      },
      { status: 500 }
    );
  }
}