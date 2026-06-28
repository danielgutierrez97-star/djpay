"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function buscarDJ(texto: string) {
    setQuery(texto);

    if (!texto.trim()) {
      setResultados([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/search-dj?q=${encodeURIComponent(texto)}`
      );

      const data = await response.json();

      setResultados(data);

    } catch (error) {
      console.error(error);
      alert("Error buscando DJs");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white text-black p-6">

      <div className="w-full max-w-md mx-auto border-2 border-black rounded-3xl p-8 bg-white shadow-2xl">

        <div className="flex justify-between items-center mb-8">

          <a
            href="/login"
            className="
              border-2
              border-black
              px-4
              py-2
              rounded-xl
              text-sm
              font-semibold
              hover:bg-violet-50
              transition
            "
          >
            Iniciar sesión
          </a>

          <a
            href="/crear-cuenta"
            className="
              text-violet-600
              text-sm
              font-bold
            "
          >
            Crear cuenta
          </a>

        </div>

        <div className="text-center">

          <img
            src="/logo.png"
            alt="DJPAY"
            className="w-48 mx-auto mb-6"
          />

          <h2 className="text-2xl font-black mb-6">
            Recibe aportes mientras tocas.
          </h2>

          <div className="relative">

            <input
              type="text"
              value={query}
              onChange={(e) => buscarDJ(e.target.value)}
              placeholder="Buscar DJ por nombre o Instagram..."
              className="
                w-full
                p-4
                rounded-xl
                border
                border-violet-400
                outline-none
                focus:border-violet-600
                mb-2
              "
            />

            {loading && (
              <p className="mb-4 text-sm text-gray-500">
                Buscando...
              </p>
            )}

            {resultados.length > 0 && (
              <div className="
                mb-8
                flex
                flex-col
                gap-2
              ">

                {resultados.map((dj) => (
                  <a
                    key={dj.instagram}
                    href={`/${dj.instagram}`}
                    className="
                      border
                      border-violet-200
                      rounded-xl
                      p-4
                      text-left
                      hover:bg-violet-50
                      transition
                    "
                  >
                    <div className="font-bold">
                      {dj.nombre}
                    </div>

                    <div className="text-gray-500">
                      @{dj.instagram}
                    </div>

                  </a>
                ))}

              </div>
            )}

          </div>

        </div>

        <div className="grid gap-4">

          <div className="border-2 border-black rounded-2xl p-5 bg-white shadow-lg text-center">

            <div className="text-3xl mb-2">
              🎧
            </div>

            <h3 className="font-bold">
              Encuentra a tu DJ favorito
            </h3>

          </div>

          <div className="border-2 border-black rounded-2xl p-5 bg-white shadow-lg text-center">

            <div className="text-3xl mb-2">
              💬
            </div>

            <h3 className="font-bold">
              Déjale un comentario
            </h3>

          </div>

          <div className="border-2 border-black rounded-2xl p-5 bg-white shadow-lg text-center">

            <div className="text-3xl mb-2">
              💸
            </div>

            <h3 className="font-bold">
              Haz tu aporte
            </h3>

          </div>

        </div>

      </div>

    </main>
  );
}