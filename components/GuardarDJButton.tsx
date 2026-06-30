"use client";

import { useState } from "react";

export default function GuardarDJButton({
  data,
}: {
  data: any;
}) {
  const [loading, setLoading] = useState(false);

  async function guardar() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/backoffice/update-dj",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!result.success) {
        alert(result.error);
        return;
      }

      alert("DJ actualizado correctamente");

      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Error actualizando DJ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={guardar}
      disabled={loading}
      className="
        bg-violet-600
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        hover:bg-violet-700
        transition
        disabled:opacity-50
      "
    >
      {loading
        ? "Guardando..."
        : "💾 Guardar cambios"}
    </button>
  );
}