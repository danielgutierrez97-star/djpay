import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    console.log("PAGANDO TIP:", id);

    const result = await sql`
      UPDATE tips
      SET pagado = true
      WHERE id = ${id}
      RETURNING *
    `;

    console.log(result);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}