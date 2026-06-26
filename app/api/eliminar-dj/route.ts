import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { djId } = await request.json();

    if (!djId) {
      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );
    }

    await sql`
      DELETE FROM djs
      WHERE id = ${djId}
    `;

    revalidatePath("/backoffice");
    revalidatePath("/backoffice/solicitudes");

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Error eliminando DJ",
      },
      {
        status: 500,
      }
    );
  }
}