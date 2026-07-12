import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

import QRCodeCard from "@/components/djpay-studio/QRCodeCard";

export const dynamic = "force-dynamic";

const sql = neon(process.env.DATABASE_URL!);

export default async function MiQRPage() {
  const cookieStore = await cookies();

  const session = cookieStore.get("dj_session")?.value;

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

          <Link
            href="/dashboard"
            className="
              border-2
              border-black
              rounded-2xl
              px-5
              py-2
              font-medium
              text-black
              hover:bg-gray-50
              transition
            "
          >
            ← Dashboard
          </Link>

        </div>

        <div className="mt-12 flex items-center justify-center gap-3">

          <span className="text-3xl text-violet-600">
            ▣
          </span>

          <h1 className="text-3xl font-bold text-black">
            Mi QR
          </h1>

        </div>

        <div className="mt-10">

          <QRCodeCard instagram={dj.instagram} />

        </div>

      </div>
    </main>
  );
}