"use client";

import { useRouter } from "next/navigation";

export default function VerificarInstagramButton({
  djId,
}: {
  djId: number;
}) {
  const router = useRouter();

  async function verificar() {
    const ok = confirm(
      "¿Confirmas que verificaste este Instagram mediante el código enviado por DM?"
    );

    if (!ok) {
      return;
    }

    const response = await fetch(
      "/api/verificar-instagram",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          djId,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      router.refresh();
      return;
    }

    alert(
      data.error ||
        "Error verificando Instagram"
    );
  }

  return (
    <button
      onClick={verificar}
      className="
        bg-green-600
        hover:bg-green-700
        text-white
        px-4
        py-2
        rounded-xl
        text-sm
        font-medium
        transition
      "
    >
      ✓ Verificar Instagram
    </button>
  );
}