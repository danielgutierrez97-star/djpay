"use client";

import { useRouter } from "next/navigation";

export default function LiquidarDJButton({
  dj,
}: {
  dj: string;
}) {
  const router = useRouter();

  const liquidarDJ = async () => {
    const ok = confirm(
      `¿Liquidar todos los pagos pendientes de @${dj}?`
    );

    if (!ok) return;

    const response = await fetch(
      "/api/liquidar-dj",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dj,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(
        data.error || "Error al liquidar DJ"
      );
      return;
    }

    alert("Liquidación realizada");

    router.refresh();
  };

  return (
    <button
      onClick={liquidarDJ}
      className="
        bg-violet-600
        hover:bg-violet-700
        text-white
        px-3
        py-2
        rounded-lg
        text-sm
        font-medium
        transition
      "
    >
      Liquidar
    </button>
  );
}