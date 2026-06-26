"use client";

import { useState } from "react";

const BANCOS = [
  "Banco de Chile",
  "Banco Estado",
  "Santander",
  "BCI",
  "Scotiabank",
  "Itaú",
  "Banco Falabella",
  "Banco Security",
  "Banco Internacional",
  "Mercado Pago",
  "Otro",
];

const TIPOS_CUENTA = [
  "Cuenta Corriente",
  "Cuenta Vista",
  "Cuenta de Ahorro",
  "Cuenta Empresa",
  "Otra",
];

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
    tipo_liquidacion: "TRANSFERENCIA",
    comision: 12,
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
      alert(
        `✅ Cuenta creada correctamente.\n\nTu código de verificación es:\n\n${data.codigoVerificacion}\n\nEnvíalo por mensaje directo a @djpay.cl para verificar que la cuenta de Instagram te pertenece.\n\nTu solicitud quedará pendiente de aprobación.\n\nAhora volverás al inicio.`
      );

      window.location.href = "/";
      return;
    }

    alert(data.error || "Error al crear cuenta.");
  }

  function cambiarMetodo(tipo: string) {
    setForm({
      ...form,
      tipo_liquidacion: tipo,
      comision: tipo === "MERCADOPAGO" ? 11 : 12,
      banco:
        tipo === "MERCADOPAGO"
          ? "Mercado Pago"
          : "",
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-2 border-black rounded-[32px] p-8 shadow-2xl">

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
            className="w-full h-[58px] px-4 rounded-xl border-2 border-gray-300 text-black bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value,
              })
            }
          />

          <input
            placeholder="Instagram"
            className="w-full h-[58px] px-4 rounded-xl border-2 border-gray-300 text-black bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                instagram: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            className="w-full h-[58px] px-4 rounded-xl border-2 border-gray-300 text-black bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full h-[58px] px-4 rounded-xl border-2 border-gray-300 text-black bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <div className="border-2 border-gray-300 rounded-xl p-4">
            <p className="font-bold text-black mb-3">
              Método de cobro
            </p>

            <label className="flex items-center gap-3 mb-2 text-black cursor-pointer">
              <input
                type="radio"
                checked={
                  form.tipo_liquidacion ===
                  "TRANSFERENCIA"
                }
                onChange={() =>
                  cambiarMetodo("TRANSFERENCIA")
                }
              />

              <span>
                Transferencia bancaria (12% comisión)
              </span>
            </label>

            <label className="flex items-center gap-3 text-black cursor-pointer">
              <input
                type="radio"
                checked={
                  form.tipo_liquidacion ===
                  "MERCADOPAGO"
                }
                onChange={() =>
                  cambiarMetodo("MERCADOPAGO")
                }
              />

              <span>
                Mercado Pago (11% comisión)
              </span>
            </label>
          </div>

          <input
            placeholder="RUT"
            className="w-full h-[58px] px-4 rounded-xl border-2 border-gray-300 text-black bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                rut: e.target.value,
              })
            }
          />

          <select
            value={form.banco}
            disabled={
              form.tipo_liquidacion ===
              "MERCADOPAGO"
            }
            className="
              w-full
              h-[58px]
              px-4
              rounded-xl
              border-2
              border-gray-300
              text-black
              bg-white
              appearance-none
              disabled:bg-gray-100
              disabled:text-gray-500
              disabled:cursor-not-allowed
            "
            onChange={(e) =>
              setForm({
                ...form,
                banco: e.target.value,
              })
            }
          >
            <option value="">
              Selecciona tu banco
            </option>

            {BANCOS.map((banco) => (
              <option
                key={banco}
                value={banco}
              >
                {banco}
              </option>
            ))}
          </select>

          <select
            value={form.tipo_cuenta}
            className="
              w-full
              h-[58px]
              px-4
              rounded-xl
              border-2
              border-gray-300
              text-black
              bg-white
              appearance-none
            "
            onChange={(e) =>
              setForm({
                ...form,
                tipo_cuenta: e.target.value,
              })
            }
          >
            <option value="">
              Tipo de cuenta
            </option>

            {TIPOS_CUENTA.map((tipo) => (
              <option
                key={tipo}
                value={tipo}
              >
                {tipo}
              </option>
            ))}
          </select>

          <input
            placeholder="Número de cuenta"
            className="w-full h-[58px] px-4 rounded-xl border-2 border-gray-300 text-black bg-white"
            onChange={(e) =>
              setForm({
                ...form,
                numero_cuenta: e.target.value,
              })
            }
          />

          <div className="border-2 border-violet-200 bg-violet-50 rounded-xl p-4">
            <p className="font-bold text-violet-700 mb-2">
              Verificación Instagram
            </p>

            <p className="text-sm text-gray-600">
              DJPay generará automáticamente un código de verificación.
              Después de crear tu cuenta, deberás enviarlo por mensaje
              directo a <strong>@djpay.cl</strong> para validar que la
              cuenta de Instagram te pertenece.
            </p>
          </div>

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