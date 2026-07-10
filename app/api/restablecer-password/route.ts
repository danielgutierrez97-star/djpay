import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

import { hashResetToken } from "@/lib/passwordReset";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Datos incompletos.",
        },
        {
          status: 400,
        }
      );
    }

    const tokenHash = hashResetToken(token);

    const djs = await sql`
      SELECT id
      FROM djs
      WHERE
        reset_token_hash = ${tokenHash}
        AND reset_token_expira > NOW()
      LIMIT 1
    `;

    if (djs.length === 0) {
      return NextResponse.json(
        {
          error:
            "El enlace es inválido o ha expirado.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    await sql`
      UPDATE djs
      SET
        password_hash = ${passwordHash},
        reset_token_hash = NULL,
        reset_token_expira = NULL
      WHERE id = ${djs[0].id}
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}