import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import MarcarPagadoButton from "@/components/MarcarPagadoButton";

const sql = neon(process.env.DATABASE_URL!);

export default async function AdminPage({
  params,
}: {
  params: Promise<{ dj: string }>;
}) {
  const { dj } = await params;

  const tips = await sql`
    SELECT *
    FROM tips
    WHERE dj = ${dj}
    ORDER BY created_at DESC
  `;

  const total = tips.reduce(
    (sum, tip: any) => sum + Number(tip.monto),
    0
  );

  const totalPendienteBruto = tips
    .filter((tip: any) => !tip.pagado)
    .reduce(
      (sum, tip: any) => sum + Number(tip.monto),
      0
    );

  const totalPagadoBruto = tips
    .filter((tip: any) => tip.pagado)
    .reduce(
      (sum, tip: any) => sum + Number(tip.monto),
      0
    );

  const totalPendiente = Math.round(
    totalPendienteBruto * 0.89
  );

  const totalPagado = Math.round(
    totalPagadoBruto * 0.89
  );

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <div className="w-full max-w-md mx-auto border-2 border-black rounded-3xl p-8 bg-white shadow-2xl">

        <div className="text-center mb-10">

          <Image
            src="/logo.png"
            alt="DJPAY"
            width={180}
            height={180}
            className="mx-auto mb-4"
          />

          <h1 className="text-4xl font-black text-black">
            Panel DJ
          </h1>

          <h2 className="text-violet-500 font-semibold text-lg mt-2 mb-8">
            @{dj}
          </h2>

        </div>

        <div className="grid gap-4 mb-8">

          <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              Total recibido
            </p>

            <p className="text-4xl font-black text-violet-600">
              ${total.toLocaleString("es-CL")}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              Pendiente DJ
            </p>

            <p className="text-4xl font-black text-violet-600">
              ${totalPendiente.toLocaleString("es-CL")}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              Ya pagado
            </p>

            <p className="text-4xl font-black text-violet-600">
              ${totalPagado.toLocaleString("es-CL")}
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-lg">
            <p className="text-neutral-500">
              Total propinas
            </p>

            <p className="text-4xl font-black">
              {tips.length}
            </p>
          </div>

        </div>

        <div className="space-y-4">

          {tips.map((tip: any) => (
            <div
              key={tip.id}
              className="bg-white border-2 border-black rounded-3xl p-5 shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">

                <div className="flex-1">

                  <p className="font-bold text-lg">
                    @{tip.instagram || "anonimo"}
                  </p>

                  <p
                    className={`text-sm font-medium mt-1 ${
                      tip.pagado
                        ? "text-green-600"
                        : "text-violet-600"
                    }`}
                  >
                    {tip.pagado
                      ? "✅ Pagado"
                      : "⏳ Pendiente"}
                  </p>

                  {!tip.pagado && (
                    <MarcarPagadoButton
                      tipId={tip.id}
                    />
                  )}

                </div>

                <p className="text-violet-600 font-black text-xl">
                  $
                  {Number(tip.monto).toLocaleString(
                    "es-CL"
                  )}
                </p>

              </div>

              {tip.comentario && (
                <p className="text-neutral-700">
                  {tip.comentario}
                </p>
              )}

              <p className="text-neutral-500 text-sm mt-3">
                {new Date(
                  tip.created_at
                ).toLocaleString("es-CL")}
              </p>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}