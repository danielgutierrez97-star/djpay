"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/backoffice/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/backoffice");
      return;
    }

    alert("Usuario o contraseña incorrectos");
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
          Backoffice DJPay
        </h1>

        <p className="text-center text-gray-700 mb-8">
          Acceso de administrador
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-2 border-black rounded-2xl p-4 text-black placeholder:text-gray-400 outline-none focus:border-violet-600"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-black rounded-2xl p-4 text-black placeholder:text-gray-400 outline-none focus:border-violet-600"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white rounded-2xl p-4 font-bold hover:bg-violet-700 transition"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}