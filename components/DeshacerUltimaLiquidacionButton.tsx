"use client";

import { useRouter } from "next/navigation";

export default function DeshacerUltimaLiquidacionButton({
  liquidacionId,
}: {
  liquidacionId: number;
}) {
  const router = useRouter();

  const deshacer = async () => {
    const ok = confirm(
      "¿Deshacer la última liquidación de este DJ?"
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
        data.error ||
          "Error deshaciendo liquidación"
      );
      return;
    }

    alert("Liquidación deshecha");

    router.refresh();
  };

  return (
    <button
      onClick={deshacer}
      className="
        border
        border-black
        bg-white
        hover:bg-neutral-100
        text-black
        px-3
        py-2
        rounded-lg
        text-sm
        font-medium
        transition
      "
    >
      Deshacer
    </button>
  );
}