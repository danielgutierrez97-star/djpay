"use client";

import { useRouter } from "next/navigation";

export default function DeshacerLiquidacionButton({
  liquidacionId,
}: {
  liquidacionId: number;
}) {
  const router = useRouter();

  const deshacerLiquidacion = async () => {
    const ok = confirm(
      "¿Deshacer esta liquidación?\n\nLas propinas asociadas volverán a estar pendientes."
    );

    if (!ok) return;

    const response = await fetch(
      "/api/deshacer-liquidacion",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: liquidacionId,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(
        data.error || "Error deshaciendo liquidación"
      );
      return;
    }

    alert("✅ Liquidación deshecha");

    router.refresh();
  };

  return (
    <button
      onClick={deshacerLiquidacion}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold"
    >
      ↩️ Deshacer
    </button>
  );
}