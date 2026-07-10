import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { usuario, password } =
      await request.json();

    const djs = await sql`
      SELECT *
      FROM djs
      WHERE
        LOWER(instagram) = LOWER(${usuario})
        OR LOWER(email) = LOWER(${usuario})
      LIMIT 1
    `;

    if (djs.length === 0) {
      return NextResponse.json(
        {
          error: "Usuario o contraseña incorrectos",
        },
        {
          status: 401,
        }
      );
    }

    const dj = djs[0];

    const validPassword =
      await bcrypt.compare(
        password,
        dj.password_hash
      );

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Usuario o contraseña incorrectos",
        },
        {
          status: 401,
        }
      );
    }

    if (!dj.instagram_verificado) {
      return NextResponse.json(
        {
          error:
            "Tu Instagram aún no ha sido verificado por DJPay.",
        },
        {
          status: 403,
        }
      );
    }

    if (!dj.activo) {
      return NextResponse.json(
        {
          error:
            "Tu cuenta aún no ha sido aprobada por DJPay.",
        },
        {
          status: 403,
        }
      );
    }

    // Si por alguna razón el DJ no tiene session_token,
    // se genera uno automáticamente.
    let sessionToken = dj.session_token;

    if (!sessionToken) {
      sessionToken = crypto.randomUUID();

      await sql`
        UPDATE djs
        SET session_token = ${sessionToken}
        WHERE id = ${dj.id}
      `;
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set(
      "dj_session",
      sessionToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      }
    );

    return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}