import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import AprobarDJButton from "@/components/AprobarDJButton";
import EliminarDJButton from "@/components/EliminarDJButton";
import VerificarInstagramButton from "@/components/VerificarInstagramButton";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function SolicitudesPage() {
  const solicitudes = await sql`
    SELECT *
    FROM djs
    WHERE activo = false
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
              <h1 className="text-3xl font-semibold tracking-tight">
                DJPay Backoffice
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Gestión de solicitudes
              </p>
            </div>
          </div>

          <div className="flex gap-3">

            <Link
              href="/backoffice"
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
              Dashboard
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
              Historial
            </Link>

            <Link
              href="/backoffice/solicitudes"
              className="
                bg-violet-600
                text-white
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
              "
            >
              Solicitudes
            </Link>

            <LogoutButton />

          </div>

        </div>

        <div className="border border-black rounded-3xl shadow-2xl overflow-hidden">

          <div className="p-6 border-b bg-neutral-50">

            <h2 className="text-2xl font-semibold">
              Solicitudes pendientes
            </h2>

            <p className="text-sm text-neutral-500 mt-1">
              DJs registrados pendientes de validación
            </p>

          </div>

          {solicitudes.length === 0 ? (

            <div className="p-16 text-center">

              <p className="text-2xl font-semibold">
                No hay solicitudes pendientes
              </p>

              <p className="text-neutral-500 mt-2">
                Los nuevos registros aparecerán aquí.
              </p>

            </div>

          ) : (

            <div className="divide-y">

              {solicitudes.map((dj: any) => (

                <div
                  key={dj.id}
                  className="p-8"
                >

                  <div className="mb-6">

                    <h3 className="text-2xl font-semibold">
                      @{dj.instagram}
                    </h3>

                    <p className="text-violet-600">
                      {dj.nombre}
                    </p>

                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">

                    <div>
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {dj.email || "-"}
                    </div>

                    <div>
                      <span className="font-semibold">
                        RUT:
                      </span>{" "}
                      {dj.rut || "-"}
                    </div>

                    <div>
                      <span className="font-semibold">
                        Banco:
                      </span>{" "}
                      {dj.banco || "-"}
                    </div>

                    <div>
                      <span className="font-semibold">
                        Tipo de cuenta:
                      </span>{" "}
                      {dj.tipo_cuenta || "-"}
                    </div>

                    <div>
                      <span className="font-semibold">
                        Método:
                      </span>{" "}
                      {dj.tipo_liquidacion || "TRANSFERENCIA"}
                    </div>

                    <div>
                      <span className="font-semibold">
                        Comisión:
                      </span>{" "}
                      {dj.comision || 12}%
                    </div>

                    <div>
                      <span className="font-semibold">
                        Código Instagram:
                      </span>{" "}
                      <span className="font-mono text-violet-600 font-bold">
                        {dj.codigo_verificacion || "-"}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold">
                        Estado Instagram:
                      </span>{" "}

                      {dj.instagram_verificado ? (
                        <span className="text-green-600 font-semibold">
                          ✅ Verificado
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">
                          ⏳ Pendiente
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="flex gap-3 mt-8">

                    {!dj.instagram_verificado && (
                      <VerificarInstagramButton
                        djId={dj.id}
                      />
                    )}

                    {dj.instagram_verificado && (
                      <AprobarDJButton
                        djId={dj.id}
                      />
                    )}

                    <EliminarDJButton
                      djId={dj.id}
                    />

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}