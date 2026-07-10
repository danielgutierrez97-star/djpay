import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

import DJAvatar from "@/components/DJAvatar";
import UploadPhotoButton from "@/components/UploadPhotoButton";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function PerfilPage() {
  const cookieStore = await cookies();

  const session =
    cookieStore.get("dj_session")?.value;

  if (!session) {
    redirect("/login");
  }

  const djs = await sql`
    SELECT *
    FROM djs
    WHERE session_token = ${session}
    LIMIT 1
  `;

  if (djs.length === 0) {
    redirect("/login");
  }

  const dj = djs[0];

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto border-4 border-black rounded-3xl shadow-2xl p-8">

        <div className="flex items-center justify-between">

          <Image
            src="/logo.png"
            alt="DJPay"
            width={70}
            height={70}
          />

          <h1 className="text-xl font-bold text-black">
            Mi perfil
          </h1>

        </div>

        <div className="flex flex-col items-center mt-6">

          <DJAvatar
            foto={dj.foto_perfil}
            nombre={dj.nombre}
            size={96}
          />

          <UploadPhotoButton />

          <p className="mt-3 text-2xl font-bold text-black">
            {dj.nombre}
          </p>

          <p className="mt-1 text-violet-600 font-medium">
            @{dj.instagram}
          </p>

        </div>

        <p className="mt-8 mb-6 text-center text-gray-600 font-medium">
          Información de la cuenta
        </p>

        <div>

          <div className="border-2 border-black rounded-2xl p-4">
            <p className="text-sm text-gray-500">
              Banco
            </p>

            <p className="mt-2 text-xl font-bold text-black">
              {dj.banco || "-"}
            </p>
          </div>

          <div className="mt-6 border-2 border-black rounded-2xl p-4">
            <p className="text-sm text-gray-500">
              Tipo de cuenta
            </p>

            <p className="mt-2 text-xl font-bold text-black">
              {dj.tipo_cuenta || "-"}
            </p>
          </div>

          <div className="mt-6 border-2 border-black rounded-2xl p-4">
            <p className="text-sm text-gray-500">
              Número de cuenta
            </p>

            <p className="mt-2 text-xl font-bold text-black">
              {dj.numero_cuenta || "-"}
            </p>
          </div>

          <div className="mt-6 border-2 border-black rounded-2xl p-4">
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="mt-2 text-xl font-bold text-black">
              {dj.email || "-"}
            </p>
          </div>

        </div>

        <Link
          href="/dashboard"
          className="
            block
            mt-8
            text-center
            text-violet-600
            font-semibold
          "
        >
          ← Volver al panel
        </Link>

      </div>
    </main>
  );
}