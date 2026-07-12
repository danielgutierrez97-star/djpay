"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RestablecerPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (password !== confirmacion) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    if (!token) {
      alert("El enlace es inválido.");
      return;
    }

    setLoading(true);

    const res = await fetch(
      "/api/restablecer-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      }
    );

    setLoading(false);

    const data = await res.json();

    if (!res.ok) {
      alert(
        data.error ||
          "No fue posible cambiar la contraseña."
      );
      return;
    }

    router.replace(
      "/login?passwordReset=success"
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border-4 border-black shadow-2xl p-8">

        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="DJPay"
            className="h-20 object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-black">
          Nueva contraseña
        </h1>

        <p className="text-center text-gray-700 mb-8">
          Crea una nueva contraseña para acceder a tu cuenta DJPay.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
              w-full
              border-2
              border-black
              rounded-2xl
              p-4
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-violet-600
            "
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmacion}
            onChange={(e) =>
              setConfirmacion(e.target.value)
            }
            className="
              w-full
              border-2
              border-black
              rounded-2xl
              p-4
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-violet-600
            "
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-violet-600
              text-white
              rounded-2xl
              p-4
              font-bold
              hover:bg-violet-700
              transition
              disabled:opacity-60
            "
          >
            {loading
              ? "Actualizando..."
              : "Cambiar contraseña"}
          </button>

        </form>

      </div>
    </main>
  );
}

export default function RestablecerPasswordPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerPasswordContent />
    </Suspense>
  );
}