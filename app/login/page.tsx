"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const passwordReset = searchParams.get("passwordReset");

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/login-dj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario,
        password,
      }),
    });

    setLoading(false);

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard");
      return;
    }

    alert(
      data.error ||
        "Error al iniciar sesión"
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
          Ingresar a DJPay
        </h1>

        <p className="text-center text-gray-700 mb-6">
          Accede a tu panel de DJ
        </p>

        {passwordReset === "success" && (
          <div
            className="
              mb-6
              rounded-2xl
              border-2
              border-green-600
              bg-green-50
              p-4
              text-center
            "
          >
            <p className="font-semibold text-green-700">
              ✅ Tu contraseña fue actualizada correctamente.
            </p>

            <p className="mt-1 text-sm text-green-700">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Instagram o correo"
            value={usuario}
            onChange={(e) =>
              setUsuario(e.target.value)
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
            placeholder="Contraseña"
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
            "
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/recuperar-password"
              className="
                text-sm
                text-neutral-500
                hover:text-violet-600
                transition
              "
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>

      </div>
    </main>
  );
}

export default function DJLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}