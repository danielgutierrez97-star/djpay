import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

import DJLogoutButton from "@/components/DJLogoutButton";
import DJAvatar from "@/components/DJAvatar";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const session =
    cookieStore.get("dj_session")?.value;

  if (!session) {
    redirect("/login");
  }

  const djs = await sql`
    SELECT *
    FROM djs
    WHERE token_admin = ${session}
    LIMIT 1
  `;

  if (djs.length === 0) {
    redirect("/login");
  }

  const dj = djs[0];

  const tips = await sql`
    SELECT *
    FROM tips
    WHERE dj = ${dj.instagram}
  `;

  const total = tips.reduce(
    (sum: number, tip: any) =>
      sum + Number(tip.monto),
    0
  );

  const pendiente = tips
    .filter((tip: any) => !tip.liquidado)
    .reduce(
      (sum: number, tip: any) =>
        sum + Number(tip.neto_dj || 0),
      0
    );

  const ultimasPropinas = [...tips]
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  const link = `djpay.cl/${dj.instagram}`;

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

          <DJLogoutButton variant="compact" />

        </div>

        <div className="mt-2 flex flex-col items-center">

          <DJAvatar
            foto={dj.foto_perfil}
            nombre={dj.nombre}
            size={88}
          />

          <h1 className="mt-6 text-3xl font-bold text-black text-center">
            Hola, {dj.nombre} 👋
          </h1>

          <p className="text-gray-600 mt-2 text-center">
            Tu panel DJPay
          </p>

        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">

          <Link
            href="/dashboard/propinas"
            className="
              border-2
              border-black
              rounded-2xl
              p-4
              text-center
              font-semibold
              text-black
              hover:bg-gray-50
              transition
            "
          >
            💜 Propinas
          </Link>

          <Link
            href="/dashboard/perfil"
            className="
              border-2
              border-black
              rounded-2xl
              p-4
              text-center
              font-semibold
              text-black
              hover:bg-gray-50
              transition
            "
          >
            ⚙️ Mi perfil
          </Link>

        </div>

        <div className="mt-6 border-2 border-black rounded-2xl p-4">

          <p className="font-bold text-black mb-2">
            🔗 Mi DJPay
          </p>

          <p className="text-violet-600 break-all">
            {link}
          </p>

        </div>

        <div className="mt-6 border-2 border-black rounded-2xl p-4">

          <p className="text-gray-500">
            Total generado
          </p>

          <p className="text-2xl font-bold text-violet-600 mt-1">
            $
            {total.toLocaleString("es-CL")}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            {tips.length} propinas · $
            {pendiente.toLocaleString("es-CL")} por
            liquidar
          </p>

        </div>

        <div className="mt-6 border-2 border-black rounded-2xl p-4">

          <p className="font-bold text-black mb-4">
            Últimas propinas
          </p>

          {ultimasPropinas.length === 0 && (
            <p className="text-sm text-gray-500">
              Aún no has recibido propinas 💜
            </p>
          )}

          {ultimasPropinas.map(
            (tip: any, index: number) => (
              <div key={tip.id}>

                <p className="font-medium text-black">
                  💜 Anónimo · +
                  ${tip.monto.toLocaleString("es-CL")}
                </p>

                {tip.comentario && (
                  <p className="mt-1 italic text-gray-700">
                    "{tip.comentario}"
                  </p>
                )}

                <p className="mt-2 text-sm text-gray-500">
                  {new Date(
                    tip.created_at
                  ).toLocaleDateString(
                    "es-CL"
                  )}
                </p>

                {index <
                  ultimasPropinas.length - 1 && (
                  <hr className="my-4 border-gray-200" />
                )}

              </div>
            )
          )}

        </div>

      </div>
    </main>
  );
}