import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function LiquidacionesPage() {
  await requireAdmin();

  const liquidaciones = await sql`
    SELECT *
    FROM liquidaciones
    ORDER BY created_at DESC
  `;

  return (
    <main className="min-h-screen bg-white text-black p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-10">

          <div className="flex items-center gap-4">

            <Image
              src="/logo.png"
              alt="DJPAY"
              width={70}
              height={70}
            />

            <div>
              <h1 className="text-4xl font-black">
                LIQUIDACIONES
              </h1>

              <p className="text-violet-600">
                Historial de pagos realizados
              </p>
            </div>

          </div>

          <Link
            href="/backoffice"
            className="
              bg-violet-600
              text-white
              px-5
              py-3
              rounded-xl
              font-bold
            "
          >
            ← Volver
          </Link>

        </div>

        <div className="border-2 border-black rounded-3xl overflow-hidden shadow-2xl">

          {liquidaciones.length === 0 ? (

            <div className="p-16 text-center">

              <p className="text-2xl font-bold mb-2">
                No hay liquidaciones
              </p>

              <p className="text-neutral-500">
                Cuando realices transferencias a los DJs,
                aparecerán aquí.
              </p>

            </div>

          ) : (

            <table className="w-full">

              <thead className="bg-violet-600 text-white">

                <tr>

                  <th className="text-left p-5">
                    DJ
                  </th>

                  <th className="text-left p-5">
                    Monto bruto
                  </th>

                  <th className="text-left p-5">
                    Propinas
                  </th>

                  <th className="text-left p-5">
                    Fecha
                  </th>

                </tr>

              </thead>

              <tbody>

                {liquidaciones.map((item: any) => (

                  <tr
                    key={item.id}
                    className="border-t"
                  >

                    <td className="p-5 font-bold">
                      @{item.dj}
                    </td>

                    <td className="p-5 text-green-600 font-bold">
                      $
                      {Number(item.monto).toLocaleString(
                        "es-CL"
                      )}
                    </td>

                    <td className="p-5">
                      {item.cantidad_propinas}
                    </td>

                    <td className="p-5">
                      {new Date(
                        item.created_at
                      ).toLocaleString("es-CL")}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </main>
  );
}