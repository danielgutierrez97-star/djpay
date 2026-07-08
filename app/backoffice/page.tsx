import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";
import LiquidarDJButton from "@/components/LiquidarDJButton";
import DeshacerUltimaLiquidacionButton from "@/components/DeshacerUltimaLiquidacionButton";
import LogoutButton from "@/components/LogoutButton";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminHome() {
  await requireAdmin();

  const tips = await sql`
    SELECT *
    FROM tips
    ORDER BY created_at DESC
  `;

  const liquidaciones = await sql`
    SELECT *
    FROM liquidaciones
    ORDER BY created_at DESC
  `;

  const solicitudesPendientes = await sql`
    SELECT COUNT(*) as total
    FROM djs
    WHERE activo = false
  `;

  const totalSolicitudes = Number(
    solicitudesPendientes[0].total
  );

  const totalDjsRegistrados = await sql`
    SELECT COUNT(*) as total
    FROM djs
  `;

  const totalDjs = Number(
    totalDjsRegistrados[0].total
  );

  const ultimaLiquidacionMap = new Map();

  liquidaciones.forEach((liquidacion: any) => {
    if (!ultimaLiquidacionMap.has(liquidacion.dj)) {
      ultimaLiquidacionMap.set(
        liquidacion.dj,
        liquidacion
      );
    }
  });

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

    if (!tip.liquidado) {
      item.pendiente += Number(tip.neto_dj || 0);
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
              <h1 className="text-3xl font-semibold tracking-tight">
                DJPay Backoffice
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Panel de administración
              </p>
            </div>

          </div>

          <div className="flex gap-3 flex-wrap">

            <Link
              href="/backoffice/pagos"
              className="
                border
                border-black
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                hover:bg-violet-50
                transition
              "
            >
              💸 Pagos
            </Link>

            <Link
              href="/backoffice/djs"
              className="
                border
                border-black
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                hover:bg-violet-50
                transition
              "
            >
              🎧 DJs
            </Link>

            <Link
              href="/backoffice/liquidaciones"
              className="
                border
                border-black
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                hover:bg-violet-50
                transition
              "
            >
              🏦 Liquidaciones
            </Link>

            <Link
              href="/backoffice/solicitudes"
              className="
                border
                border-black
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                hover:bg-violet-50
                transition
              "
            >
              🔔 Solicitudes
              {totalSolicitudes > 0 &&
                ` (${totalSolicitudes})`}
            </Link>

            <LogoutButton />

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="border border-black rounded-3xl p-6 shadow-lg">
            <p className="text-sm text-neutral-500">
              Total plataforma
            </p>

            <p className="text-3xl font-semibold text-violet-600">
              $
              {totalPlataforma.toLocaleString("es-CL")}
            </p>
          </div>

          <div className="border border-black rounded-3xl p-6 shadow-lg">
            <p className="text-sm text-neutral-500">
              Total pendiente DJs
            </p>

            <p className="text-3xl font-semibold text-violet-600">
              $
              {totalPendiente.toLocaleString("es-CL")}
            </p>
          </div>

          <div className="border border-black rounded-3xl p-6 shadow-lg">
            <p className="text-sm text-neutral-500">
              DJs registrados
            </p>

            <p className="text-3xl font-semibold">
              {totalDjs}
            </p>
          </div>

        </div>

        <div className="border border-black rounded-3xl overflow-hidden shadow-2xl">

          <table className="w-full">

            <thead className="bg-neutral-50 border-b">

              <tr>
                <th className="text-left p-5 text-sm font-semibold">
                  DJ
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Pendiente
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Total
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Propinas
                </th>

                <th className="text-left p-5 text-sm font-semibold">
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
                  <td className="p-5 font-semibold">
                    @{dj.nombre}
                  </td>

                  <td className="p-5 text-violet-600 font-semibold">
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

                  <td className="p-5 flex gap-2">

                    <Link
                      href={`/backoffice/djs/${dj.nombre}`}
                      className="
                        border
                        border-black
                        rounded-lg
                        px-3
                        py-2
                        text-sm
                        font-medium
                        hover:bg-violet-50
                        transition
                      "
                    >
                      ✏️ Editar DJ
                    </Link>

                    {dj.pendiente > 0 ? (
                      <LiquidarDJButton
                        dj={dj.nombre}
                      />
                    ) : (
                      ultimaLiquidacionMap.has(
                        dj.nombre
                      ) && (
                        <DeshacerUltimaLiquidacionButton
                          liquidacionId={
                            ultimaLiquidacionMap.get(
                              dj.nombre
                            ).id
                          }
                        />
                      )
                    )}

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
