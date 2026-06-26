import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { djId } = await request.json();

    if (!djId) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    await sql`
      UPDATE djs
      SET instagram_verificado = true
      WHERE id = ${djId}
    `;

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error verificando Instagram",
      },
      {
        status: 500,
      }
    );
  }
}