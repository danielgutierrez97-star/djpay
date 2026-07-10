import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

import { crearResetToken } from "@/lib/passwordReset";
import { enviarCorreoRecuperarPassword } from "@/lib/enviarCorreoRecuperarPassword";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          error: "Correo requerido",
        },
        {
          status: 400,
        }
      );
    }

    const djs = await sql`
      SELECT id, nombre, email
      FROM djs
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `;

    if (djs.length > 0) {
      const dj = djs[0];

      const {
        token,
        tokenHash,
        expira,
      } = crearResetToken();

      await sql`
        UPDATE djs
        SET
          reset_token_hash = ${tokenHash},
          reset_token_expira = ${expira}
        WHERE id = ${dj.id}
      `;

      await enviarCorreoRecuperarPassword({
        nombre: dj.nombre,
        email: dj.email,
        token,
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Si existe una cuenta asociada a ese correo, te enviaremos un enlace para crear una nueva contraseña.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}