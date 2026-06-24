"use client";

import { useState, use } from "react";
import Image from "next/image";

export default function DJPage({
  params,
}: {
  params: Promise<{ dj: string }>;
}) {
  const { dj } = use(params);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [instagram, setInstagram] = useState("");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAmount) {
      alert("Selecciona un monto");
      return;
    }

    try {
      const response = await fetch("/api/tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dj,
          instagram,
          mensaje: message,
          monto: selectedAmount,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Error guardando apoyo");
        return;
      }

      setCompleted(true);
    } catch (error) {
      console.error(error);
      alert("Error guardando apoyo");
    }
  };

  if (completed) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="w-full max-w-md border-2 border-black rounded-3xl p-8 bg-white shadow-2xl text-center">

          <Image
            src="/logo.png"
            alt="DJPAY"
            width={160}
            height={160}
            className="mx-auto mb-6"
          />

          <h1 className="text-3xl font-bold mb-4">
            Gracias por apoyar a
          </h1>

          <h2 className="text-4xl font-black text-violet-500 uppercase mb-6 break-words">
            {dj}
          </h2>

          <p className="text-neutral-700 text-xl mb-8">
            Monto: $
            {selectedAmount?.toLocaleString("es-CL")}
          </p>

          <button
            onClick={() => setCompleted(false)}
            className="w-full bg-violet-600 text-white font-bold p-4 rounded-xl text-lg"
          >
            Volver
          </button>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <div className="w-full max-w-md border-2 border-black rounded-3xl p-8 bg-white shadow-2xl">

        <div className="text-center mb-8">

          <Image
            src="/logo.png"
            alt="DJPAY"
            width={160}
            height={160}
            className="mx-auto mb-4"
          />

          <h1 className="text-3xl sm:text-5xl font-black uppercase leading-tight break-words text-center px-2">
            {dj}
          </h1>

          <p className="text-violet-500 font-semibold text-base sm:text-lg mt-2 break-all">
            @{dj}
          </p>

          <p className="text-neutral-600 mt-4 px-2">
            Apoya la música que estás disfrutando
          </p>

        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Tu Instagram
          </label>

          <input
            type="text"
            placeholder="@usuario"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full p-4 rounded-xl bg-white border border-violet-400 outline-none focus:border-violet-600"
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium">
            Enviar mensaje al DJ
          </label>

          <textarea
            placeholder="Escribe tu apoyo..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 rounded-xl bg-white border border-violet-400 outline-none focus:border-violet-600"
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-3 mb-8">

          <button
            onClick={() => setSelectedAmount(1500)}
            className={`p-4 rounded-xl border font-semibold ${
              selectedAmount === 1500
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white border-violet-400 hover:border-violet-600"
            }`}
          >
            $1.500
          </button>

          <button
            onClick={() => setSelectedAmount(2000)}
            className={`p-4 rounded-xl border font-semibold ${
              selectedAmount === 2000
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white border-violet-400 hover:border-violet-600"
            }`}
          >
            $2.000
          </button>

          <button
            onClick={() => setSelectedAmount(3000)}
            className={`p-4 rounded-xl border font-semibold ${
              selectedAmount === 3000
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white border-violet-400 hover:border-violet-600"
            }`}
          >
            $3.000
          </button>

          <button
            onClick={() => setSelectedAmount(5000)}
            className={`p-4 rounded-xl border font-semibold ${
              selectedAmount === 5000
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white border-violet-400 hover:border-violet-600"
            }`}
          >
            $5.000
          </button>

          <button
            onClick={() => setSelectedAmount(10000)}
            className="p-5 rounded-xl border-2 font-bold bg-gradient-to-r from-violet-700 to-purple-500 text-white border-violet-700 shadow-lg"
          >
            ⭐ FAN DESTACADO · $10.000
          </button>

        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-violet-600 text-white font-bold p-4 rounded-xl text-lg"
        >
          ENVIAR APOYO
        </button>

      </div>
    </main>
  );
}