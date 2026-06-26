import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

import CopyLinkButton from "@/components/CopyLinkButton";
import DJLogoutButton from "@/components/DJLogoutButton";

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
    .filter((tip: any) => !tip.pagado)
    .reduce(
      (sum: number, tip: any) =>
        sum + Number(tip.monto),
      0
    );

  const link = `https://djpay.cl/${dj.instagram}`;

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto border-4 border-black rounded-3xl shadow-2xl p-8">

        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="DJPay"
            width={100}
            height={100}
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-black">
          Hola, {dj.nombre} 👋
        </h1>

        <p className="text-center text-gray-600 mt-2">
          Tu panel DJPay
        </p>

        <div className="mt-8 border-2 border-black rounded-2xl p-4">

          <p className="font-bold text-black mb-2">
            Tu link DJPay
          </p>

          <p className="text-violet-600 break-all mb-4">
            {link}
          </p>

          <div className="space-y-3">

            <CopyLinkButton
              link={link}
            />

            <Link
              href={`/${dj.instagram}`}
              target="_blank"
              className="
                block
                w-full
                text-center
                border-2
                border-black
                rounded-2xl
                p-4
                font-bold
                hover:bg-black-100
                transition
              "
            >
              🎧 Ver mi DJPay
            </Link>

          </div>

        </div>

        <div className="mt-6 space-y-4">

          <div className="border-2 border-black rounded-2xl p-4">
            <p className="text-gray-500">
              Propinas recibidas
            </p>

            <p className="text-3xl font-bold text-black">
              {tips.length}
            </p>
          </div>

          <div className="border-2 border-black rounded-2xl p-4">
            <p className="text-gray-500">
              Total generado
            </p>

            <p className="text-3xl font-bold text-violet-600">
              $
              {total.toLocaleString(
                "es-CL"
              )}
            </p>
          </div>

          <div className="border-2 border-black rounded-2xl p-4">
            <p className="text-gray-500">
              Pendiente por liquidar
            </p>

            <p className="text-3xl font-bold text-violet-600">
              $
              {pendiente.toLocaleString(
                "es-CL"
              )}
            </p>
          </div>

          <div className="border-2 border-black rounded-2xl p-4">
            <p className="text-gray-500">
              Método de cobro
            </p>

            <p className="text-xl font-bold text-black">
              {dj.tipo_liquidacion}
            </p>
          </div>

        </div>

        <div className="mt-6">
          <DJLogoutButton />
        </div>

      </div>
    </main>
  );
}