"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(
        "/api/recuperar-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: correo,
          }),
        }
      );

      if (res.ok) {
        setEnviado(true);
      } else {
        alert("Ocurrió un error. Inténtalo nuevamente.");
      }
    } catch {
      alert("Ocurrió un error. Inténtalo nuevamente.");
    }

    setLoading(false);
  }

  if (enviado) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border-4 border-black shadow-2xl p-8 text-center">

          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="DJPay"
              className="h-20 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold text-black mb-4">
            Revisa tu correo
          </h1>

          <p className="text-gray-700 leading-7 mb-8">
            Si existe una cuenta asociada a ese correo,
            recibirás un enlace para crear una nueva contraseña.
          </p>

          <Link
            href="/login"
            className="
              inline-block
              bg-violet-600
              text-white
              rounded-2xl
              px-8
              py-4
              font-bold
              hover:bg-violet-700
              transition
            "
          >
            Volver al inicio de sesión
          </Link>

        </div>
      </main>
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
          Recuperar contraseña
        </h1>

        <p className="text-center text-gray-700 mb-8">
          Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) =>
              setCorreo(e.target.value)
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
              ? "Enviando..."
              : "Enviar enlace"}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="
                text-sm
                text-neutral-500
                hover:text-violet-600
                transition
              "
            >
              Volver al inicio de sesión
            </Link>
          </div>

        </form>

      </div>
    </main>
  );
}