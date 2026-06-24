"use client";

import { useState } from "react";

export default function CrearCuenta() {
  const [form, setForm] = useState({
    nombre: "",
    instagram: "",
    email: "",
    password: "",
    rut: "",
    banco: "",
    tipo_cuenta: "",
    numero_cuenta: "",
  });

  async function registrar() {
    const response = await fetch("/api/register-dj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      alert("Cuenta creada. Será revisada por DJPAY.");
    } else {
      alert(data.error || "Error al crear cuenta.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white border-2 border-black rounded-[32px] p-8 shadow-xl">

        <div className="text-center mb-8">

          <img
            src="/logo.png"
            alt="DJPAY"
            className="w-28 mx-auto mb-4"
          />

          <h1 className="text-4xl font-black text-black">
            Crear cuenta
          </h1>

          <p className="text-gray-600 mt-2">
            Registra tu perfil DJ en DJPAY
          </p>

        </div>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Nombre DJ"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
          />

          <input
            placeholder="Instagram"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({ ...form, instagram: e.target.value })
            }
          />

          <input
            placeholder="Email"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <input
            placeholder="RUT"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({ ...form, rut: e.target.value })
            }
          />

          <input
            placeholder="Banco"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({ ...form, banco: e.target.value })
            }
          />

          <input
            placeholder="Tipo de cuenta"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                tipo_cuenta: e.target.value,
              })
            }
          />

          <input
            placeholder="Número de cuenta"
            className="w-full p-4 rounded-xl border-2 border-gray-300 text-black placeholder-gray-500 bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                numero_cuenta: e.target.value,
              })
            }
          />

          <button
            onClick={registrar}
            className="mt-2 bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-xl font-bold text-lg transition"
          >
            Crear cuenta
          </button>

        </div>

      </div>

    </main>
  );
}