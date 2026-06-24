"use client";

import { useRouter } from "next/navigation";

export default function MarcarPagadoButton({
  tipId,
}: {
  tipId: number;
}) {
  const router = useRouter();

  const marcarPagado = async () => {
    const ok = confirm(
      "¿Marcar esta propina como pagada?"
    );

    if (!ok) return;

    await fetch("/api/tips/pagar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: tipId,
      }),
    });

    router.refresh();
  };

  return (
    <button
      onClick={marcarPagado}
      className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl"
    >
      💸 Marcar como pagado
    </button>
  );
}