"use client";

import { useRouter } from "next/navigation";

export default function EliminarDJButton({
  djId,
}: {
  djId: number;
}) {
  const router = useRouter();

  async function eliminar() {
    const ok = confirm(
      "¿Eliminar este registro?"
    );

    if (!ok) {
      return;
    }

    const response = await fetch(
      "/api/eliminar-dj",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
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
        "Error eliminando DJ"
    );
  }

  return (
    <button
      onClick={eliminar}
      className="
        border
        border-red-500
        text-red-500
        hover:bg-red-50
        px-4
        py-2
        rounded-xl
        text-sm
        font-medium
        transition
      "
    >
      Eliminar
    </button>
  );
}