import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";
import DJsTable from "@/components/DJsTable";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function DJsPage() {
  await requireAdmin();

  const djs = await sql`
    SELECT *
    FROM djs
    ORDER BY created_at DESC
  `;

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
                DJs
              </h1>

              <p className="text-sm text-neutral-500">
                Gestión completa de artistas
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

        <div className="grid md:grid-cols-1 gap-4 mb-8">

          <div className="border border-black rounded-3xl p-6 shadow-lg">

            <p className="text-sm text-neutral-500">
              Total DJs registrados
            </p>

            <p className="text-3xl font-semibold text-violet-600">
              {djs.length}
            </p>

          </div>

        </div>

        <DJsTable djs={djs} />

      </div>
    </main>
  );
}