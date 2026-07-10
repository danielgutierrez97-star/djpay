import { put, del } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const session =
      cookieStore.get("dj_session")?.value;

    if (!session) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const djs = await sql`
      SELECT *
      FROM djs
      WHERE session_token = ${session}
      LIMIT 1
    `;

    if (djs.length === 0) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const dj = djs[0];

    const formData =
      await request.formData();

    const file =
      formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Archivo requerido",
        },
        { status: 400 }
      );
    }

    // Eliminar foto anterior si existe
    if (dj.foto_perfil) {
      try {
        await del(dj.foto_perfil);

        console.log(
          "Foto anterior eliminada:",
          dj.foto_perfil
        );

      } catch (error) {
        console.error(
          "No se pudo eliminar la foto anterior:",
          error
        );
      }
    }

    // Subir nueva foto
    const blob = await put(
      `djs/${dj.instagram}-${Date.now()}`,
      file,
      {
        access: "public",
      }
    );

    // Guardar URL en la base de datos
    await sql`
      UPDATE djs
      SET foto_perfil = ${blob.url}
      WHERE id = ${dj.id}
    `;

    return NextResponse.json({
      success: true,
      url: blob.url,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error subiendo foto",
      },
      { status: 500 }
    );
  }
}