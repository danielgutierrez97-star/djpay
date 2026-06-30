"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function DJsTable({
  djs,
}: {
  djs: any[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "todos" | "activos" | "pendientes"
  >("todos");

  const [selectedDjs, setSelectedDjs] = useState<
    number[]
  >([]);

  const filteredDjs = useMemo(() => {
    return djs.filter((dj) => {
      const nombre = (
        dj.nombre || ""
      ).toLowerCase();

      const instagram = (
        dj.instagram || ""
      ).toLowerCase();

      const texto = search.toLowerCase();

      const matchesSearch =
        nombre.includes(texto) ||
        instagram.includes(texto);

      const matchesFilter =
        filter === "todos"
          ? true
          : filter === "activos"
          ? dj.activo
          : !dj.activo;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [djs, search, filter]);

  function toggleDJ(id: number) {
    setSelectedDjs((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  }

  function exportCSV() {
    const data = djs
      .filter((dj) =>
        selectedDjs.includes(dj.id)
      )
      .map((dj) => ({
        instagram: dj.instagram,
        nombre: dj.nombre,
        email: dj.email,
        rut: dj.rut,
        banco: dj.banco,
        tipo_cuenta:
          dj.tipo_cuenta,
        numero_cuenta:
          dj.numero_cuenta,
        comision:
          dj.comision || 12,
        activo: dj.activo
          ? "Sí"
          : "No",
      }));

    const csv = Papa.unparse(data);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(
      blob,
      `djs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
  }

  return (
    <div className="space-y-6">

      <div className="border border-black rounded-3xl p-6 shadow-lg">

        <input
          type="text"
          placeholder="🔍 Buscar DJ..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            border
            border-black
            rounded-xl
            p-4
            outline-none
            focus:border-violet-600
          "
        />

        <div className="flex gap-3 mt-4 flex-wrap">

          <button
            onClick={() =>
              setFilter("todos")
            }
            className={`px-4 py-2 rounded-xl border transition ${
              filter === "todos"
                ? "bg-violet-600 text-white border-violet-600"
                : "border-black hover:bg-violet-50"
            }`}
          >
            Todos
          </button>

          <button
            onClick={() =>
              setFilter("activos")
            }
            className={`px-4 py-2 rounded-xl border transition ${
              filter === "activos"
                ? "bg-green-600 text-white border-green-600"
                : "border-black hover:bg-green-50"
            }`}
          >
            Activos
          </button>

          <button
            onClick={() =>
              setFilter(
                "pendientes"
              )
            }
            className={`px-4 py-2 rounded-xl border transition ${
              filter ===
              "pendientes"
                ? "bg-yellow-500 text-white border-yellow-500"
                : "border-black hover:bg-yellow-50"
            }`}
          >
            Pendientes
          </button>

        </div>

      </div>

      {selectedDjs.length > 0 && (

        <div className="border border-black rounded-3xl p-6 shadow-lg flex items-center justify-between">

          <p className="font-semibold">
            {selectedDjs.length} DJ
            {selectedDjs.length > 1
              ? "s"
              : ""}{" "}
            seleccionado
            {selectedDjs.length > 1
              ? "s"
              : ""}
          </p>

          <button
            onClick={exportCSV}
            className="
              bg-violet-600
              text-white
              px-5
              py-3
              rounded-xl
              font-medium
              hover:bg-violet-700
              transition
            "
          >
            📄 Exportar CSV
          </button>

        </div>

      )}

      <div className="border border-black rounded-3xl overflow-hidden shadow-2xl">

        {filteredDjs.length ===
        0 ? (
          <div className="p-16 text-center">

            <p className="text-2xl font-semibold">
              No se encontraron DJs
            </p>

          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-neutral-50 border-b">

              <tr>

                <th className="p-5">
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Instagram
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Nombre
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Estado
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Comisión
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredDjs.map(
                (dj) => (
                  <tr
                    key={dj.id}
                    className="border-t"
                  >

                    <td className="p-5">

                      <input
                        type="checkbox"
                        checked={selectedDjs.includes(
                          dj.id
                        )}
                        onChange={() =>
                          toggleDJ(
                            dj.id
                          )
                        }
                      />

                    </td>

                    <td className="p-5 font-semibold">
                      @{dj.instagram}
                    </td>

                    <td className="p-5">
                      {dj.nombre ||
                        "-"}
                    </td>

                    <td className="p-5">

                      {dj.activo ? (
                        <span className="text-green-600 font-semibold">
                          ✅ Activo
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">
                          ⏳ Pendiente
                        </span>
                      )}

                    </td>

                    <td className="p-5">
                      {dj.comision ||
                        12}
                      %
                    </td>

                    <td className="p-5">

                      <Link
                        href={`/backoffice/djs/${dj.instagram}`}
                        className="
                          border
                          border-black
                          rounded-xl
                          px-4
                          py-2
                          text-sm
                          font-medium
                          hover:bg-violet-50
                          transition
                        "
                      >
                        Editar
                      </Link>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}