"use client";

import { useRouter } from "next/navigation";

export default function AprobarDJButton({
  djId,
}: {
  djId: number;
}) {
  const router = useRouter();

  async function aprobar() {
    const ok = confirm(
      "¿Aprobar este DJ?"
    );

    if (!ok) {
      return;
    }

    const response = await fetch(
      "/api/aprobar-dj",
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
        "Error aprobando DJ"
    );
  }

  return (
    <button
      onClick={aprobar}
      className="
        bg-violet-600
        hover:bg-violet-700
        text-white
        px-4
        py-2
        rounded-xl
        text-sm
        font-medium
        transition
      "
    >
      Aprobar
    </button>
  );
}