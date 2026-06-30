"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function PagosTable({
  pagos,
}: {
  pagos: any[];
}) {
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "todos" | "approved" | "pending"
  >("todos");

  const [selectedPagos, setSelectedPagos] =
    useState<number[]>([]);

  const filteredPagos = useMemo(() => {
    return pagos.filter((pago) => {
      const dj = (
        pago.dj || ""
      ).toLowerCase();

      const cliente = (
        pago.instagram || ""
      ).toLowerCase();

      const texto = search.toLowerCase();

      const matchesSearch =
        dj.includes(texto) ||
        cliente.includes(texto);

      const matchesFilter =
        filter === "todos"
          ? true
          : filter === "approved"
          ? pago.estado === "approved"
          : pago.estado !== "approved";

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [pagos, search, filter]);

  function togglePago(id: number) {
    setSelectedPagos((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  }

  function exportCSV() {
    const data = pagos
      .filter((pago) =>
        selectedPagos.includes(
          pago.id
        )
      )
      .map((pago) => ({
        fecha: new Date(
          pago.created_at
        ).toLocaleString("es-CL"),

        dj: pago.dj,

        cliente:
          pago.instagram,

        comentario:
          pago.comentario,

        bruto: pago.monto,

        comision:
          pago.comision,

        neto_dj:
          pago.neto_dj,

        estado:
          pago.estado,
      }));

    const csv =
      Papa.unparse(data);

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(
      blob,
      `pagos-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
  }

  return (
    <div className="space-y-6">

      <div className="border border-black rounded-3xl p-6 shadow-lg">

        <input
          type="text"
          placeholder="🔍 Buscar DJ o cliente..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
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
              setFilter(
                "approved"
              )
            }
            className={`px-4 py-2 rounded-xl border transition ${
              filter ===
              "approved"
                ? "bg-green-600 text-white border-green-600"
                : "border-black hover:bg-green-50"
            }`}
          >
            Aprobados
          </button>

          <button
            onClick={() =>
              setFilter(
                "pending"
              )
            }
            className={`px-4 py-2 rounded-xl border transition ${
              filter ===
              "pending"
                ? "bg-yellow-500 text-white border-yellow-500"
                : "border-black hover:bg-yellow-50"
            }`}
          >
            Pendientes
          </button>

        </div>

      </div>

      {selectedPagos.length >
        0 && (
        <div className="border border-black rounded-3xl p-6 shadow-lg flex items-center justify-between">

          <p className="font-semibold">
            {
              selectedPagos.length
            }{" "}
            pago
            {selectedPagos.length >
            1
              ? "s"
              : ""}{" "}
            seleccionado
            {selectedPagos.length >
            1
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

        {filteredPagos.length ===
        0 ? (
          <div className="p-16 text-center">

            <p className="text-2xl font-semibold">
              No se encontraron
              pagos
            </p>

          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-neutral-50 border-b">

              <tr>

                <th className="p-5"></th>

                <th className="text-left p-5 text-sm font-semibold">
                  Fecha
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  DJ
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Cliente
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Bruto
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Comisión
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Neto DJ
                </th>

                <th className="text-left p-5 text-sm font-semibold">
                  Estado
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPagos.map(
                (pago: any) => (
                  <tr
                    key={pago.id}
                    className="border-t"
                  >

                    <td className="p-5">

                      <input
                        type="checkbox"
                        checked={selectedPagos.includes(
                          pago.id
                        )}
                        onChange={() =>
                          togglePago(
                            pago.id
                          )
                        }
                      />

                    </td>

                    <td className="p-5 text-sm">
                      {new Date(
                        pago.created_at
                      ).toLocaleString(
                        "es-CL"
                      )}
                    </td>

                    <td className="p-5 font-semibold">
                      @{pago.dj}
                    </td>

                    <td className="p-5">
                      {pago.instagram ||
                        "-"}
                    </td>

                    <td className="p-5 font-semibold">
                      $
                      {Number(
                        pago.monto
                      ).toLocaleString(
                        "es-CL"
                      )}
                    </td>

                    <td className="p-5 text-red-500">
                      $
                      {Number(
                        pago.comision ||
                          0
                      ).toLocaleString(
                        "es-CL"
                      )}
                    </td>

                    <td className="p-5 text-green-600 font-semibold">
                      $
                      {Number(
                        pago.neto_dj ||
                          0
                      ).toLocaleString(
                        "es-CL"
                      )}
                    </td>

                    <td className="p-5">

                      {pago.estado ===
                      "approved" ? (
                        <span className="text-green-600 font-semibold">
                          ✅
                          Aprobado
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">
                          ⏳
                          Pendiente
                        </span>
                      )}

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