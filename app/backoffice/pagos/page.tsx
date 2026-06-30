import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";
import PagosTable from "@/components/PagosTable";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function PagosPage() {
  await requireAdmin();

  const pagos = await sql`
    SELECT *
    FROM tips
    ORDER BY created_at DESC
  `;

  const totalBruto = pagos.reduce(
    (sum: number, pago: any) =>
      sum + Number(pago.monto || 0),
    0
  );

  const totalComisiones = pagos.reduce(
    (sum: number, pago: any) =>
      sum + Number(pago.comision || 0),
    0
  );

  const totalNeto = pagos.reduce(
    (sum: number, pago: any) =>
      sum + Number(pago.neto_dj || 0),
    0
  );

  return (
    <main className="min-h-screen bg-white text-black p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">

          <div className="flex items-center gap-4">

            <Image
              src="/logo.png"
              alt="DJPAY"
              width={70}
              height={70}
            />

            <div>

              <h1 className="text-3xl font-semibold tracking-tight">
                Pagos
              </h1>

              <p className="text-sm text-neutral-500">
                Historial financiero completo
              </p>

            </div>

          </div>

          <Link
            href="/backoffice"
            className="
              border
              border-black
              rounded-xl
              px-5
              py-3
              text-sm
              font-medium
              hover:bg-violet-50
              transition
              w-fit
            "
          >
            ← Volver
          </Link>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="border border-black rounded-3xl p-6 shadow-lg">

            <p className="text-sm text-neutral-500">
              Total bruto
            </p>

            <p className="text-3xl font-semibold text-violet-600">
              $
              {totalBruto.toLocaleString("es-CL")}
            </p>

          </div>

          <div className="border border-black rounded-3xl p-6 shadow-lg">

            <p className="text-sm text-neutral-500">
              Comisiones DJPay
            </p>

            <p className="text-3xl font-semibold text-red-500">
              $
              {totalComisiones.toLocaleString("es-CL")}
            </p>

          </div>

          <div className="border border-black rounded-3xl p-6 shadow-lg">

            <p className="text-sm text-neutral-500">
              Neto DJs
            </p>

            <p className="text-3xl font-semibold text-green-600">
              $
              {totalNeto.toLocaleString("es-CL")}
            </p>

          </div>

        </div>

        <PagosTable pagos={pagos} />

      </div>

    </main>
  );
}