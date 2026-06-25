import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminHome() {
  const tips = await sql`
    SELECT *
    FROM tips
    ORDER BY created_at DESC
  `;

  const djsMap = new Map();

  tips.forEach((tip: any) => {
    const dj = tip.dj;

    if (!djsMap.has(dj)) {
      djsMap.set(dj, {
        nombre: dj,
        total: 0,
        pendiente: 0,
        propinas: 0,
      });
    }

    const item = djsMap.get(dj);

    item.total += Number(tip.monto);
    item.propinas += 1;

    if (!tip.pagado) {
      item.pendiente += Number(tip.monto);
    }
  });

  const djs = Array.from(djsMap.values());

  const totalPlataforma = djs.reduce(
    (sum, dj: any) => sum + dj.total,
    0
  );

  const totalPendiente = djs.reduce(
    (sum, dj: any) => sum + dj.pendiente,
    0
  );

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
                DJPAY ADMIN
              </h1>

              <p className="text-violet-600">
                Panel general de administración
              </p>
            </div>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              Total plataforma
            </p>

            <p className="text-4xl font-black text-violet-600">
              $
              {totalPlataforma.toLocaleString(
                "es-CL"
              )}
            </p>
          </div>

          <div className="border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              Total pendiente DJs
            </p>

            <p className="text-4xl font-black text-violet-600">
              $
              {totalPendiente.toLocaleString(
                "es-CL"
              )}
            </p>
          </div>

          <div className="border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              DJs registrados
            </p>

            <p className="text-4xl font-black">
              {djs.length}
            </p>
          </div>

        </div>

        <div className="border-2 border-black rounded-3xl overflow-hidden shadow-2xl">

          <table className="w-full">

            <thead className="bg-violet-600 text-white">

              <tr>
                <th className="text-left p-5">
                  DJ
                </th>

                <th className="text-left p-5">
                  Pendiente
                </th>

                <th className="text-left p-5">
                  Total
                </th>

                <th className="text-left p-5">
                  Propinas
                </th>

                <th className="text-left p-5">
                  Acciones
                </th>
              </tr>

            </thead>

            <tbody>

              {djs.map((dj: any) => (
                <tr
                  key={dj.nombre}
                  className="border-t"
                >
                  <td className="p-5 font-bold">
                    @{dj.nombre}
                  </td>

                  <td className="p-5 text-violet-600 font-bold">
                    $
                    {dj.pendiente.toLocaleString(
                      "es-CL"
                    )}
                  </td>

                  <td className="p-5">
                    $
                    {dj.total.toLocaleString(
                      "es-CL"
                    )}
                  </td>

                  <td className="p-5">
                    {dj.propinas}
                  </td>

                  <td className="p-5">

                    <Link
                      href={`/admin/${dj.nombre}`}
                      className="bg-violet-600 text-white px-4 py-2 rounded-xl font-bold"
                    >
                      👁 Ver DJ
                    </Link>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}