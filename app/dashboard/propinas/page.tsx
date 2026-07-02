import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function PropinasPage() {
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
    ORDER BY created_at DESC
  `;

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
            Mis propinas
          </h1>

        </div>

        <p className="mt-6 mb-6 text-center text-gray-600 font-medium">
          Historial completo
        </p>

        <div>

          {tips.length === 0 && (
            <div className="border-2 border-black rounded-2xl p-4">
              <p className="text-gray-500">
                Aún no has recibido propinas 💜
              </p>
            </div>
          )}

          {tips.map((tip: any, index: number) => (
            <div
              key={tip.id}
              className={`
                border-2
                border-black
                rounded-2xl
                p-4
                ${index > 0 ? "mt-6" : ""}
              `}
            >
              <div className="flex justify-between items-center">

                <p className="font-medium text-black">
                  💜 Anónimo
                </p>

                <p className="text-xl font-bold text-violet-600">
                  +$
                  {tip.monto.toLocaleString("es-CL")}
                </p>

              </div>

              {tip.comentario && (
                <p className="mt-3 italic text-gray-700">
                  "{tip.comentario}"
                </p>
              )}

              <div className="mt-4 flex justify-between text-sm text-gray-500">

                <p>
                  {new Date(
                    tip.created_at
                  ).toLocaleDateString("es-CL")}
                </p>

                <p className="font-medium">
                  {tip.liquidado
                    ? "✅ Liquidada"
                    : "🟡 Pendiente"}
                </p>

              </div>

            </div>
          ))}

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