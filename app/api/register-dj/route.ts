import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);

function generarToken() {
  return crypto.randomUUID();
}

function generarCodigoVerificacion() {
  return Math.floor(
    10000 + Math.random() * 90000
  ).toString();
}

export async function POST(request: Request) {
  try {
    const {
      nombre,
      instagram,
      email,
      password,
      rut,
      banco,
      tipo_cuenta,
      numero_cuenta,
      tipo_liquidacion,
      comision,
    } = await request.json();

    if (
      !nombre ||
      !instagram ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    const existe = await sql`
      SELECT id
      FROM djs
      WHERE instagram = ${instagram}
      LIMIT 1
    `;

    if (existe.length > 0) {
      return NextResponse.json(
        { error: "Instagram ya registrado" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const tokenAdmin = generarToken();

    const codigoVerificacion =
      generarCodigoVerificacion();

    await sql`
      INSERT INTO djs (
        nombre,
        instagram,
        email,
        rut,
        banco,
        tipo_cuenta,
        numero_cuenta,
        tipo_liquidacion,
        comision,
        codigo_verificacion,
        instagram_verificado,
        password_hash,
        token_admin,
        activo
      )
      VALUES (
        ${nombre},
        ${instagram},
        ${email},
        ${rut},
        ${banco},
        ${tipo_cuenta},
        ${numero_cuenta},
        ${tipo_liquidacion || "TRANSFERENCIA"},
        ${comision || 12},
        ${codigoVerificacion},
        false,
        ${passwordHash},
        ${tokenAdmin},
        false
      )
    `;

    return NextResponse.json({
      success: true,
      codigoVerificacion,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error creando DJ" },
      { status: 500 }
    );
  }
}