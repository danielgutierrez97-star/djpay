"use client";

import { useState } from "react";

export default function DJEditor({
  dj,
}: {
  dj: any;
}) {
  const [form, setForm] = useState({
    id: dj.id,
    nombre: dj.nombre || "",
    email: dj.email || "",
    rut: dj.rut || "",
    banco: dj.banco || "",
    tipo_cuenta: dj.tipo_cuenta || "",
    numero_cuenta: dj.numero_cuenta || "",
    tipo_liquidacion:
      dj.tipo_liquidacion || "TRANSFERENCIA",
    comision: dj.comision || 12,
    activo: dj.activo,
  });

  const [loading, setLoading] = useState(false);

  function updateField(
    field: string,
    value: string | number | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function guardarCambios() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/backoffice/update-dj",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(
          data.error ||
            "Error actualizando DJ"
        );
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
    <div className="space-y-6">

      <div className="border border-black rounded-3xl p-8 shadow-lg">

        <h2 className="text-2xl font-semibold mb-6">
          Información personal
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) =>
              updateField(
                "nombre",
                e.target.value
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="RUT"
            value={form.rut}
            onChange={(e) =>
              updateField(
                "rut",
                e.target.value
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) =>
                updateField(
                  "activo",
                  e.target.checked
                )
              }
            />

            <span>
              DJ activo
            </span>

          </div>

        </div>

      </div>

      <div className="border border-black rounded-3xl p-8 shadow-lg">

        <h2 className="text-2xl font-semibold mb-6">
          Datos bancarios
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Banco"
            value={form.banco}
            onChange={(e) =>
              updateField(
                "banco",
                e.target.value
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="Tipo cuenta"
            value={form.tipo_cuenta}
            onChange={(e) =>
              updateField(
                "tipo_cuenta",
                e.target.value
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

          <input
            type="text"
            placeholder="Número cuenta"
            value={form.numero_cuenta}
            onChange={(e) =>
              updateField(
                "numero_cuenta",
                e.target.value
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

          <input
            type="number"
            placeholder="Comisión"
            value={form.comision}
            onChange={(e) =>
              updateField(
                "comision",
                Number(
                  e.target.value
                )
              )
            }
            className="
              border
              border-black
              rounded-xl
              p-3
            "
          />

        </div>

      </div>

      <button
        onClick={guardarCambios}
        disabled={loading}
        className="
          bg-violet-600
          text-white
          px-8
          py-4
          rounded-2xl
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

    </div>
  );
}